import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {IoMdArrowDropdown, IoMdMenu, IoMdClose} from "react-icons/io";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const rootRef = useRef(null);

  const goToRedirectUrl = () => {
    window.open(import.meta.env.VITE_REDIRECT_URL, "_blank");
  }

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const menus = [
    {
      key: "availability",
      label: "Properties",
      items: [
        { to: "/properties", label: "All Properties" },
        { to: "/notice", label: "Notice" },
      ],
    },
    {
      key: "apply",
      label: "Apply Now",
      items: [
        { to: "/screening", label: "Pre-Screening Form" },
      ],
    },
    {
      key: "services",
      label: "Services",
      items: [
        { to: "/services/maintenance", label: "Maintenance Service" },
      ],
    },
  ];

  return (
    <nav
      ref={rootRef}
      className="w-full top-0 z-40 bg-[var(--color-bg)] shadow-sm"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/Logo_1.png"
                alt="GMP Rentals logo"
                className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-md"
              />
              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold text-[var(--color-darker)]">
                  GMP Rentals
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <div
              onClick={goToRedirectUrl}
              role="button"
              tabIndex={0}
              className="px-3 py-1 text-xl font-bold text-[var(--color-secondary)] border-2 border-[var(--color-secondary)] rounded-2xl hover:bg-[var(--color-secondary)] hover:text-[var(--color-bg)] cursor-pointer transition"
            >
              Pay Rent
            </div>
            {localStorage.getItem("adminUser") && (
              <Link
                to="/admin"
                className="px-3 py-1 text-xl bg-[var(--color-dark)] text-[var(--color-bg)] rounded-2xl font-medium hover:bg-[var(--color-dark)]/80 transition"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((s) => !s)}
              className="p-1 rounded-md focus:outline-none"
            >
              {/* simple hamburger icon */}
              {mobileOpen ? (
                <IoMdClose className="h-7 w-7 text-[var(--color-darker)]" />
              ) : (
                <IoMdMenu className="h-7 w-7 text-[var(--color-darker)]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar (dark row) */}
      <div className="bg-[var(--color-darker)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6">
            {/* Desktop menu */}
            <ul className="hidden md:flex items-center gap-6 py-2">
              <li>
                <Link to="/" className="text-base font-medium hover:after:w-full after:block after:h-0.5 after:bg-white after:transition-all after:duration-300 after:w-0">
                  Home
                </Link>
              </li>

              {menus.map((m) => (
                <li key={m.key} className="relative">
                  <button
                    onClick={() => setOpenMenu((cur) => (cur === m.key ? null : m.key))}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setOpenMenu(null);
                    }}
                    aria-expanded={openMenu === m.key}
                    aria-controls={`${m.key}-menu`}
                    className="flex items-center gap-2 text-base font-medium px-3 py-2 rounded-full hover:bg-black/20 cursor-pointer"
                  >
                    {m.label}
                    <IoMdArrowDropdown className={`h-4 w-4 transform transition-transform duration-300 ${openMenu === m.key ? "rotate-180" : "rotate-0"}`} />
                  </button>

                  {/* dropdown */}
                  {openMenu === m.key && (
                    <div
                      id={`${m.key}-menu`}
                      role="menu"
                      className="absolute left-0 mt-2 w-48 bg-white text-[var(--color-darker)] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
                    >
                      {m.items.map((it) => (
                        <Link
                          key={it.to}
                          to={it.to}
                          onClick={() => setOpenMenu(null)}
                          className="block px-4 py-2 text-sm hover:bg-[var(--color-darker)]/5"
                          role="menuitem"
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}

              <li>
                <div onClick={goToRedirectUrl} className="text-base font-medium hover:after:w-full after:block after:h-0.5 after:bg-white after:transition-all after:duration-300 after:w-0 cursor-pointer">
                  Resident
                </div>
              </li>

              <li>
                <Link to="/about" className="text-base font-medium hover:after:w-full after:block after:h-0.5 after:bg-white after:transition-all after:duration-300 after:w-0">
                  About
                </Link>
              </li>
            </ul>

            {/* Right side actions on desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/contact"
                className="text-sm px-4 py-2 rounded-full bg-white text-[var(--color-darker)] font-semibold shadow-sm hover:bg-[var(--color-light)] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden px-4 pb-6">
            <div className="space-y-2 pt-4">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--color-bg)]/10">
                Home
              </Link>

              {/* mobile accordion for each menu */}
              {menus.map((m) => (
                <div key={m.key} className="border-t border-[var(--color-bg)]/10">
                  <button
                    onClick={() => setOpenMenu((cur) => (cur === m.key ? null : m.key))}
                    className="w-full flex items-center justify-between px-3 py-3 text-base font-medium"
                    aria-expanded={openMenu === m.key}
                  >
                    {m.label}
                    <IoMdArrowDropdown className={`h-5 w-5 transform transition-transform duration-300 ${openMenu === m.key ? "rotate-180" : "rotate-0"}`} />
                  </button>

                  {openMenu === m.key && (
                    <div className="bg-[var(--color-bg)]/5">
                      {m.items.map((it) => (
                        <Link
                          key={it.to}
                          to={it.to}
                          onClick={() => {
                            setMobileOpen(false);
                            setOpenMenu(null);
                          }}
                          className="block px-6 py-2 text-sm"
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div onClick={goToRedirectUrl} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--color-bg)]/10 cursor-pointer">
                Resident
              </div>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--color-bg)]/10">
                About
              </Link>
              <Link to="/contact" className="block px-3 py-3 rounded-md text-base font-semibold bg-[var(--color-bg)] text-[var(--color-darker)] text-center">
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
