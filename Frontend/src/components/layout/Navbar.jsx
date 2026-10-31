
import { Link, NavLink } from "react-router-dom";

// Change this path to match your actual logo file.
import ayushmanLogo from "../../assets/ayushman-logo.jpg";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex min-h-[92px] flex-wrap items-center justify-between gap-4 border-b border-[#E5E4DC] bg-[#FAF8F2] px-6 py-4 md:px-[6%]">
      {/* Logo and brand */}
      <Link
        to="/"
        className="flex items-center gap-3 text-[#47796F] no-underline"
        aria-label="MediKiosk home"
      >
        <img
          src={ayushmanLogo}
          alt="Ayushman Bharat logo"
          className="h-16 w-16 shrink-0 object-contain sm:h-[68px] sm:w-[68px]"
        />

        <div>
            <h1 className="text-xl font-bold tracking-tight text-[#214A43] sm:text-2xl">
              MediKiosk
            </h1>

            <p className="text-xs text-[#47796F] sm:text-sm">
              Ayushman Bharat Digital Health Mission
            </p>
          </div>
      </Link>

      {/* Navigation */}
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

        {/* Doctor Dashboard */}
        <Link
          to="/login"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-[#47796F] bg-[#47796F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#315E54] hover:shadow-md sm:text-base"
        >
          Doctor Dashboard
        </Link>
      </nav>
    </header>
  );
}
