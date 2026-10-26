import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractPdfText(buffer) {
  const result = await pdfParse(buffer);

  return (result.text || "")
    .replace(/\u0000/g, "")
    .trim();
}