import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const rootRef = useRef(null);

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
      label: "Availability",
      items: [
        { to: "/availability", label: "All Properties" },
      ],
    },
    {
      key: "apply",
      label: "Apply Now",
      items: [
        { to: "/apply-now", label: "Pre-Screening Questions" },
        { to: "/apply-now/status", label: "Pet-Screening Status" },
      ],
    },
    {
      key: "services",
      label: "Services",
      items: [
        { to: "/services/maintenance", label: "Maintenance Service" },
        { to: "/services/housekeeping", label: "Other Services" },
      ],
    },
  ];

  return (
    <nav
      ref={rootRef}
      className="w-full sticky top-0 z-40 bg-[var(--color-bg)] shadow-sm"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/Logo_1.png"
                alt="PropertyRent logo"
                className="w-14 h-14 object-contain rounded-md"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--color-darker)]">
                  PropertyRent
                </h1>
                <p className="text-xs -mt-1 text-[var(--color-darker)]/70">
                  Find your next home
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/pay-rent"
              className="px-3 py-1 text-md text-[var(--color-accent)] border border-[var(--color-accent)] rounded-full font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] transition"
            >
              Pay Rent
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 rounded-md focus:outline-none"
            >
              {/* simple hamburger icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar (dark row) */}
      <div className="bg-[var(--color-darker)] text-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Desktop menu */}
            <ul className="hidden md:flex items-center gap-6 py-3">
              <li>
                <Link to="/" className="text-base font-medium hover:underline">
                  Home
                </Link>
              </li>

              {menus.map((m) => (
                <li key={m.key} className="relative ">
                  <button
                    onClick={() => setOpenMenu((cur) => (cur === m.key ? null : m.key))}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setOpenMenu(null);
                    }}
                    aria-expanded={openMenu === m.key}
                    aria-controls={`${m.key}-menu`}
                    className="flex items-center gap-2 text-base font-medium px-3 py-2 rounded-md hover:bg-[var(--color-darker)]"
                  >
                    {m.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transform transition-transform ${openMenu === m.key ? "rotate-180" : "rotate-0"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* dropdown */}
                  {openMenu === m.key && (
                    <div
                      id={`${m.key}-menu`}
                      role="menu"
                      className="absolute left-0 mt-2 w-48 bg-[var(--color-bg)] text-[var(--color-darker)] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
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
                <Link to="/resident" className="text-base font-medium hover:underline">
                  Resident
                </Link>
              </li>

              <li>
                <Link to="/about" className="text-base font-medium hover:underline">
                  About
                </Link>
              </li>
            </ul>

            {/* Right side actions on desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/contact"
                className="text-sm px-4 py-2 rounded-md bg-[var(--color-bg)] text-[var(--color-darker)] font-semibold shadow-sm hover:opacity-95"
              >
                Contact
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transform transition-transform ${openMenu === m.key ? "rotate-180" : "rotate-0"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
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

              <Link to="/resident" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--color-bg)]/10">
                Resident
              </Link>
              <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[var(--color-bg)]/10">
                About
              </Link>
              <Link to="/contact" className="block px-3 py-3 rounded-md text-base font-semibold bg-[var(--color-bg)] text-[var(--color-darker)] text-center">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
