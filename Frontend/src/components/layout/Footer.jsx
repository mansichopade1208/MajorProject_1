
function LinkBrand() {
  return (
    <span className="font-bold text-[#35665D]">
      MediKiosk
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="mx-[4%] mt-5 flex flex-col items-start justify-between gap-3 border-t border-[#E0E1D8] px-2 py-4 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-4 sm:gap-5">
        <LinkBrand />
        <span className="hidden h-4 w-px bg-[#D3D9D2] sm:block" />
        <span className="text-xs text-[#78918D]">
          Your health, our priority.
        </span>
      </div>

      <p className="flex gap-2 text-xs text-[#78918D]">
        <span>Simple</span>
        <span>•</span>
        <span>Secure</span>
        <span>•</span>
        <span>Smarter</span>
      </p>
    </footer>
  );
}


