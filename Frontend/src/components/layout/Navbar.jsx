
import { Link, NavLink } from "react-router-dom";
import { Plus, UserRound } from "lucide-react";

export default function Navbar() {
  return (
    <header className="relative z-20 flex min-h-[92px] flex-wrap items-center justify-between gap-4 border-b border-[#E5E4DC] bg-[#FAF8F2] px-6 py-4 md:px-[6%]">
      <Link
        to="/"
        className="flex items-center gap-3 text-[#47796F] no-underline"
        aria-label="MediKiosk home"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#47796F] text-white sm:h-[52px] sm:w-[52px]">
          <Plus size={46} strokeWidth={5} />
        </span>
        <span className="text-[29px] font-bold tracking-tight sm:text-[36px]">
          MediKiosk
        </span>
      </Link>

      <nav className="flex w-full items-center justify-between gap-4 sm:w-auto sm:gap-8 md:gap-12">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `relative py-3 text-base transition-colors ${
              isActive
                ? "font-medium text-[#214A43] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#47796F]"
                : "text-[#55766F] hover:text-[#214A43]"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `relative py-3 text-base transition-colors ${
              isActive
                ? "font-medium text-[#214A43] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#47796F]"
                : "text-[#55766F] hover:text-[#214A43]"
            }`
          }
        >
          About
        </NavLink>

        <Link
          to="/doctor/login"
          className="flex items-center gap-2 rounded-xl border border-[#47796F] px-3 py-2.5 text-sm text-[#214A43] transition-colors hover:bg-[#EAF1EB] sm:gap-3 sm:px-5 sm:text-base"
        >
          <UserRound size={21} strokeWidth={2.5} />
          Doctor Login
        </Link>
      </nav>
    </header>
  );
}
