
import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";

import {
  Enums,
  RenderingEngine,
  imageLoader,
  metaData,
  init as cornerstoneInit,
} from "@cornerstonejs/core";

import dicomImageLoader, {
  init as dicomImageLoaderInit,
} from "@cornerstonejs/dicom-image-loader";

import {
  X,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Move,
  FlipHorizontal,
  Scan,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

let initializationPromise;

async function initializeCornerstone() {
  if (!initializationPromise) {
    initializationPromise = Promise.all([
      cornerstoneInit(),
      dicomImageLoaderInit({
        maxWebWorkers: 2,
        useLegacyMetadataProvider: true,
      }),
    ]);
  }

  await initializationPromise;
}

async function fetchDicomFiles({ documents, reportId, accessToken }) {
  const authToken = sessionStorage.getItem("medikioskToken");

  if (!authToken) {
    throw new Error("Your doctor session has expired. Please log in again.");
  }

  const output = [];
  let totalBytes = 0;

  for (const document of documents) {
    const response = await fetch(
      `${API_URL}/consultations/doctor/${reportId}/documents/${document._id}/file`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "X-Report-Access-Token": accessToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Could not download ${document.originalName}.`);
    }

    const blob = await response.blob();

    totalBytes += blob.size;

    if (totalBytes > 500 * 1024 * 1024) {
      throw new Error("The DICOM data is larger than 500 MB.");
    }

    if (
      document.mimeType === "application/zip" ||
      /\.zip$/i.test(document.originalName)
    ) {
      const zip = await JSZip.loadAsync(blob);

      const entries = Object.values(zip.files).filter(
        (entry) =>
          !entry.dir &&
          /\.dcm$/i.test(entry.name) &&
          !entry.name.split("/").some((part) => part.startsWith("__MACOSX"))
      );

      if (entries.length > 1500) {
        throw new Error("Maximum supported DICOM images: 1,500.");
      }

      for (const entry of entries) {
        const content = await entry.async("blob");

        output.push(
          new File([content], entry.name.split("/").pop(), {
            type: "application/dicom",
          })
        );
      }
    } else {
      output.push(
        new File([blob], document.originalName, {
          type: "application/dicom",
        })
      );
    }
  }

  if (!output.length) {
    throw new Error("No .dcm files were found in the uploaded files.");
  }

  if (output.length > 1500) {
    throw new Error("Maximum supported DICOM images: 1,500.");
  }

  return output;
}

// Sort CT images according to their physical slice positions.
function sortImageIds(imageIds) {
  const records = imageIds.map((imageId) => {
    const plane = metaData.get("imagePlaneModule", imageId) || {};

    const position = plane.imagePositionPatient;
    const orientation = plane.imageOrientationPatient;

    const row =
      plane.rowCosines || (orientation ? orientation.slice(0, 3) : null);

    const column =
      plane.columnCosines || (orientation ? orientation.slice(3, 6) : null);

    let location = 0;

    if (
      position &&
      row &&
      column &&
      position.length >= 3 &&
      row.length >= 3 &&
      column.length >= 3
    ) {
      const normal = [
        row[1] * column[2] - row[2] * column[1],
        row[2] * column[0] - row[0] * column[2],
        row[0] * column[1] - row[1] * column[0],
      ];

      location =
        position[0] * normal[0] +
        position[1] * normal[1] +
        position[2] * normal[2];
    }

    const series =
      metaData.get("generalSeriesModule", imageId) || {};

    return {
      imageId,
      location,
      seriesUid: series.seriesInstanceUID || "unknown",
    };
  });

  const validSeriesIds = [
    ...new Set(
      records
        .map((record) => record.seriesUid)
        .filter((id) => id && id !== "unknown")
    ),
  ];

  if (validSeriesIds.length > 1) {
    throw new Error(
      "Multiple DICOM series detected. Please upload one series at a time."
    );
  }

  return records
    .sort((a, b) => a.location - b.location)
    .map((record) => record.imageId);
}

function crossProduct(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(vector) {
  const length = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0)
  );

  if (!length) return vector;

  return vector.map((value) => value / length);
}

function addVector(a, b) {
  return a.map((value, index) => value + b[index]);
}

function multiplyVector(vector, amount) {
  return vector.map((value) => value * amount);
}

export default function DicomViewerModal({
  documents,
  reportId,
  accessToken,
  onClose,
}) {
  const viewerRef = useRef(null);
  const axialRef = useRef(null);

  const engineRef = useRef(null);
  const stackViewportRef = useRef(null);

  const imageIdsRef = useRef([]);
  const panStartRef = useRef(null);

  const [status, setStatus] = useState("Loading DICOM files...");
  const [error, setError] = useState("");

  const [loaded, setLoaded] = useState(false);
  const [currentSlice, setCurrentSlice] = useState(1);
  const [totalSlices, setTotalSlices] = useState(0);

  const [windowCenter, setWindowCenter] = useState(40);
  const [windowWidth, setWindowWidth] = useState(400);

  const [inverted, setInverted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --------------------------------------------------
  // LOAD DICOM FILES
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;
    let engine;

    async function waitForViewport() {
      const start = Date.now();

      while (Date.now() - start < 10000) {
        const element = axialRef.current;

        if (
          element &&
          element.isConnected &&
          element.clientWidth > 0 &&
          element.clientHeight > 0
        ) {
          return element;
        }

        await new Promise((resolve) =>
          requestAnimationFrame(resolve)
        );
      }

      throw new Error("DICOM viewer could not initialize its display.");
    }

    async function loadViewer() {
      try {
        await initializeCornerstone();

        if (cancelled) return;

        const files = await fetchDicomFiles({
          documents,
          reportId,
          accessToken,
        });

        if (cancelled) return;

        setStatus(`Preparing ${files.length} DICOM image(s)...`);

        const imageIds = files.map((file) =>
          dicomImageLoader.wadouri.fileManager.add(file)
        );

        // Load in small batches to reduce memory pressure.
        for (let i = 0; i < imageIds.length; i += 4) {
          const batch = imageIds.slice(i, i + 4);

          await Promise.all(
            batch.map((id) => imageLoader.loadAndCacheImage(id))
          );

          if (cancelled) return;

          setStatus(
            `Preparing images... ${Math.min(
              i + batch.length,
              imageIds.length
            )} / ${imageIds.length}`
          );
        }

        const orderedImageIds = sortImageIds(imageIds);

        if (cancelled) return;

        imageIdsRef.current = orderedImageIds;
        setTotalSlices(orderedImageIds.length);

        const element = await waitForViewport();

        if (cancelled) return;

        engine = new RenderingEngine(
          `medikiosk-dicom-${Date.now()}`
        );

        engineRef.current = engine;

        engine.setViewports([
          {
            viewportId: "DICOM_STACK",
            type: Enums.ViewportTypes.STACK,
            element,
          },
        ]);

        const viewport = engine.getViewport("DICOM_STACK");

        stackViewportRef.current = viewport;

        await viewport.setStack(orderedImageIds);

        if (cancelled) return;

        viewport.resetCamera();

        viewport.setProperties({
          voiRange: {
            lower: windowCenter - windowWidth / 2,
            upper: windowCenter + windowWidth / 2,
          },
          invert: false,
        });

        viewport.render();

        setCurrentSlice(1);
        setLoaded(true);
        setStatus(
          orderedImageIds.length > 1
            ? `CT image stack ready • ${orderedImageIds.length} slices`
            : "DICOM image ready"
        );
      } catch (err) {
        console.error("DICOM viewer error:", err);

        if (!cancelled) {
          setError(
            err.message || "Unable to display this DICOM series."
          );
        }
      }
    }

    loadViewer();

    return () => {
      cancelled = true;

      if (engine) {
        engine.destroy();
      }

      engineRef.current = null;
      stackViewportRef.current = null;
      imageIdsRef.current = [];
      panStartRef.current = null;

      dicomImageLoader.wadouri.fileManager.purge();
    };
  }, [documents, reportId, accessToken]);

  // --------------------------------------------------
  // GET VIEWPORT
  // --------------------------------------------------

  function getViewport() {
    return stackViewportRef.current;
  }

  function renderViewport(callback) {
    const viewport = getViewport();

    if (!viewport) return;

    callback(viewport);
    viewport.render();
  }

  // --------------------------------------------------
  // SCROLL THROUGH CT SLICES
  // --------------------------------------------------

  function changeSlice(direction) {
    const viewport = getViewport();

    if (!viewport || !imageIdsRef.current.length) return;

    const currentIndex = viewport.getCurrentImageIdIndex();

    const nextIndex = Math.max(
      0,
      Math.min(
        imageIdsRef.current.length - 1,
        currentIndex + direction
      )
    );

    if (nextIndex === currentIndex) return;

    viewport.setImageIdIndex(nextIndex);
    viewport.render();

    setCurrentSlice(nextIndex + 1);
  }

  useEffect(() => {
  const element = axialRef.current;

  if (!loaded || !element) return;

  function handleWheel(event) {
    event.preventDefault();

    if (event.deltaY > 0) {
      changeSlice(1);
    } else if (event.deltaY < 0) {
      changeSlice(-1);
    }
  }

  element.addEventListener("wheel", handleWheel, {
    passive: false,
  });

  return () => {
    element.removeEventListener("wheel", handleWheel);
  };
}, [loaded]);

  // --------------------------------------------------
  // WINDOW CENTER / WINDOW WIDTH
  // --------------------------------------------------

  useEffect(() => {
    if (!loaded) return;

    renderViewport((viewport) => {
      viewport.setProperties({
        voiRange: {
          lower: windowCenter - windowWidth / 2,
          upper: windowCenter + windowWidth / 2,
        },
      });
    });
  }, [windowCenter, windowWidth, loaded]);

  // --------------------------------------------------
  // ZOOM
  // --------------------------------------------------

  function zoom(factor) {
    renderViewport((viewport) => {
      const camera = viewport.getCamera();

      if (
        Number.isFinite(camera.parallelScale) &&
        camera.parallelScale > 0
      ) {
        viewport.setCamera({
          parallelScale: camera.parallelScale * factor,
        });
      }
    });
  }

  // --------------------------------------------------
  // ROTATE
  // --------------------------------------------------

  function rotateView(degrees) {
    const angle = (degrees * Math.PI) / 180;

    renderViewport((viewport) => {
      const camera = viewport.getCamera();

      const up = camera.viewUp || [0, 1, 0];
      const normal = camera.viewPlaneNormal || [0, 0, 1];

      const cross = crossProduct(normal, up);

      const nextUp = up.map(
        (value, index) =>
          value * Math.cos(angle) +
          cross[index] * Math.sin(angle)
      );

      viewport.setCamera({
        viewUp: nextUp,
      });
    });
  }

  // --------------------------------------------------
  // PAN
  // --------------------------------------------------

  function handlePanStart(event) {
    if (!loaded || event.button !== 0) return;

    const viewport = getViewport();

    if (!viewport) return;

    const camera = viewport.getCamera();
    const rect = event.currentTarget.getBoundingClientRect();

    panStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      height: rect.height,
      position: [...camera.position],
      focalPoint: [...camera.focalPoint],
      viewUp: [...camera.viewUp],
      normal: [...camera.viewPlaneNormal],
      parallelScale: camera.parallelScale,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePanMove(event) {
    const start = panStartRef.current;

    if (!start || start.pointerId !== event.pointerId) return;

    const viewport = getViewport();

    if (!viewport) return;

    const dx = event.clientX - start.startX;
    const dy = event.clientY - start.startY;

    const worldPerPixel =
      (start.parallelScale * 2) / start.height;

    const right = normalize(
      crossProduct(start.viewUp, start.normal)
    );

    const horizontalShift = multiplyVector(
      right,
      -dx * worldPerPixel
    );

    const verticalShift = multiplyVector(
      start.viewUp,
      dy * worldPerPixel
    );

    const shift = addVector(
      horizontalShift,
      verticalShift
    );

    viewport.setCamera({
      position: addVector(start.position, shift),
      focalPoint: addVector(start.focalPoint, shift),
    });

    viewport.render();
  }

  function handlePanEnd(event) {
    if (panStartRef.current?.pointerId === event.pointerId) {
      panStartRef.current = null;
    }
  }

  // --------------------------------------------------
  // INVERT
  // --------------------------------------------------

  function toggleInvert() {
    const nextValue = !inverted;

    setInverted(nextValue);

    renderViewport((viewport) => {
      viewport.setProperties({
        invert: nextValue,
      });
    });
  }

  // --------------------------------------------------
  // FIT
  // --------------------------------------------------

  function fitToScreen() {
    renderViewport((viewport) => {
      viewport.resetCamera();
    });
  }

  // --------------------------------------------------
  // FULLSCREEN
  // --------------------------------------------------

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await viewerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));

      requestAnimationFrame(() => {
        engineRef.current?.resize(true, true);
        stackViewportRef.current?.render();
      });
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  function resetView() {
    setWindowCenter(40);
    setWindowWidth(400);
    setInverted(false);

    panStartRef.current = null;

    renderViewport((viewport) => {
      viewport.setProperties({
        voiRange: {
          lower: -160,
          upper: 240,
        },
        invert: false,
      });

      viewport.resetCamera();
    });
  }

  // --------------------------------------------------
  // BUTTON STYLE
  // --------------------------------------------------

  const toolButton =
    "flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-white transition hover:bg-[#326F61] disabled:opacity-40";

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      ref={viewerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-5"
    >
      <div className="flex h-full max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-[#2D4942] bg-[#101917] text-white shadow-2xl">

        {/* HEADER */}

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="font-semibold">
              MediKiosk DICOM Viewer
            </h2>

            <p className="text-xs text-slate-400">
              {status}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className={toolButton}
              title="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 size={17} />
              ) : (
                <Maximize2 size={17} />
              )}

              <span className="hidden sm:inline">
                {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
              aria-label="Close viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CONTROLS */}

        <div className="flex flex-wrap items-center gap-4 border-b border-white/10 px-4 py-3">

          <label className="flex items-center gap-2 text-xs text-slate-300">
            Window center

            <input
              type="range"
              min="-1000"
              max="3000"
              step="5"
              value={windowCenter}
              onChange={(e) =>
                setWindowCenter(Number(e.target.value))
              }
              disabled={!loaded}
            />

            <span className="w-12 text-right tabular-nums">
              {windowCenter}
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300">
            Window width

            <input
              type="range"
              min="1"
              max="5000"
              step="5"
              value={windowWidth}
              onChange={(e) =>
                setWindowWidth(Number(e.target.value))
              }
              disabled={!loaded}
            />

            <span className="w-12 text-right tabular-nums">
              {windowWidth}
            </span>
          </label>

          <div className="ml-auto flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() => zoom(0.85)}
              disabled={!loaded}
              className={toolButton}
              title="Zoom in"
            >
              <ZoomIn size={17} />
            </button>

            <button
              type="button"
              onClick={() => zoom(1.18)}
              disabled={!loaded}
              className={toolButton}
              title="Zoom out"
            >
              <ZoomOut size={17} />
            </button>

            <button
              type="button"
              onClick={() => rotateView(-90)}
              disabled={!loaded}
              className={toolButton}
              title="Rotate left"
            >
              <RotateCcw size={17} />
            </button>

            <button
              type="button"
              onClick={() => rotateView(90)}
              disabled={!loaded}
              className={toolButton}
              title="Rotate right"
            >
              <RotateCw size={17} />
            </button>

            <button
              type="button"
              onClick={toggleInvert}
              disabled={!loaded}
              className={`${toolButton} ${
                inverted ? "bg-[#326F61]" : ""
              }`}
              title="Invert grayscale"
            >
              <FlipHorizontal size={17} />
              <span className="hidden sm:inline">Invert</span>
            </button>

            <button
              type="button"
              onClick={fitToScreen}
              disabled={!loaded}
              className={toolButton}
              title="Fit image to screen"
            >
              <Scan size={17} />
              <span className="hidden sm:inline">Fit</span>
            </button>

            <button
              type="button"
              onClick={resetView}
              disabled={!loaded}
              className={toolButton}
              title="Reset controls"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* IMAGE VIEWER */}

        {error ? (
          <div className="m-5 rounded-xl border border-red-400/30 bg-red-950/40 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : (
          <div className="relative min-h-0 flex-1 overflow-auto bg-[#080D0C] p-2">

            {!loaded && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#080D0C]/90 text-sm text-slate-300">
                {status}
              </div>
            )}

            <div className="flex min-h-[420px] flex-col items-center justify-center bg-black p-3">

              <div
                ref={axialRef}
                
                onPointerDown={handlePanStart}
                onPointerMove={handlePanMove}
                onPointerUp={handlePanEnd}
                onPointerCancel={handlePanEnd}
                className="h-[65vh] max-h-[720px] min-h-[300px] w-full max-w-[1100px] cursor-grab bg-black active:cursor-grabbing"
                style={{ touchAction: "none" }}
              />

              {loaded && totalSlices > 1 && (
                <div className="mt-3 flex w-full max-w-[500px] items-center gap-3 text-xs text-slate-300">
                  <button
                    type="button"
                    onClick={() => changeSlice(-1)}
                    disabled={currentSlice <= 1}
                    className={toolButton}
                  >
                    Previous
                  </button>

                  <input
                    type="range"
                    min="1"
                    max={totalSlices}
                    value={currentSlice}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      const viewport = getViewport();

                      if (viewport) {
                        viewport.setImageIdIndex(next - 1);
                        viewport.render();
                        setCurrentSlice(next);
                      }
                    }}
                    className="flex-1"
                  />

                  <span className="min-w-[75px] text-right tabular-nums">
                    {currentSlice} / {totalSlices}
                  </span>

                  <button
                    type="button"
                    onClick={() => changeSlice(1)}
                    disabled={currentSlice >= totalSlices}
                    className={toolButton}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2 text-[11px] text-slate-400">
          <span>
            Viewer controls adjust display only. No AI interpretation is performed.
          </span>

          <span className="flex items-center gap-1">
            <Move size={13} />
            Drag to pan • Scroll to change CT slices
          </span>
        </div>
      </div>
    </div>
  );
}
