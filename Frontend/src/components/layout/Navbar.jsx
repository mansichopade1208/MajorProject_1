
import { Link, NavLink } from "react-router-dom";
import { Plus, UserRound } from "lucide-react";

export default function Navbar() {
  return (
   
<header className="sticky top-0 z-50 flex min-h-[92px] flex-wrap items-center justify-between gap-4 border-b border-[#E5E4DC] bg-[#FAF8F2] px-6 py-4 md:px-[6%]">

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

         <div className="flex items-center gap-3">

          <Link
    to="/signup"
    className="rounded-xl border border-[#47796F] bg-[#47796F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#315E54] hover:shadow-md sm:text-base"
  >
    Sign Up
  </Link>
  
  <Link
    to="/login"
    className="rounded-xl border border-[#47796F] px-5 py-2.5 text-sm font-semibold text-[#214A43] transition-all duration-300 hover:bg-[#EAF1EB] sm:text-base"
  >
    Login
  </Link>

  
</div>

      </nav>
    </header>
  );
}
