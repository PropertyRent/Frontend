import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const primaryBtnRef = useRef(null);

  useEffect(() => {
    document.title = "404 — Page not found | PropertyRent";
    primaryBtnRef.current?.focus();
  }, []);

  return (
    <main className="flex items-center justify-center  p-6 mb-5">
      <section className="max-w-4xl w-full  rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-6xl md:text-7xl font-extrabold text-[var(--color-darker)]">404</h2>
          <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-[var(--color-darker)]/90">
            Oops — page not found
          </h3>
          <p className="mt-4 text-sm md:text-base text-[var(--color-darker)]/70">
            The page you were looking for doesn’t exist, was removed, or had its
            address changed. Try these options to get back on track.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              ref={primaryBtnRef}
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-secondary)]"
            >
              Go to Home
            </button>

            <Link
              to="/properties"
              className="px-5 py-2 rounded-lg border border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white transition-colors font-medium text-center w-full sm:w-auto"
            >
              Search Properties
            </Link>

            <Link
              to="/contact"
              className="px-5 py-2 rounded-lg text-sm text-[var(--color-darker)]/80 underline"
            >
              Contact Support
            </Link>
          </div>

          <ul className="mt-6 text-xs text-[var(--color-darker)]/60 space-y-1">
            <li>• Check the URL for typos.</li>
            <li>• Try searching from the navigation or the map view.</li>
            <li>• If you believe this is an error, reach out via Contact.</li>
          </ul>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-64 h-64 md:w-72 md:h-72 bg-gradient-to-tr from-[var(--color-darker)]/5 to-[var(--color-darker)]/10 rounded-xl flex items-center justify-center">
            <svg
              width="160"
              height="160"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect x="1" y="10" width="22" height="10" rx="2" fill="currentColor" opacity="0.06" />
              <path d="M3 10l4-6h10l4 6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              <circle cx="12" cy="13" r="1.6" fill="currentColor" opacity="0.9" />
              <path d="M8 18h8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-[var(--color-darker)]/60">
        PropertyRent • Need help? <Link to="/contact" className="underline">Contact us</Link>
      </div>
    </main>
  );
}
