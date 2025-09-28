import React from "react";

export default function UtilitySection({ mediaType, mediaSrc, onApply, onTour, onAvailability, onFaqs }) {
  function handle(fn, fallback) {
    if (typeof fn === "function") fn();
    else window.location.href = fallback;
  }

  return (
    <section className="w-full py-12 px-4 bg-[var(--color-bg)]">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-12 items-center">

        <div className="md:col-span-5 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
          {mediaType === "video" && mediaSrc ? (
            <div className="relative h-64 md:h-72">
              <video src={mediaSrc} controls className="w-full h-full object-cover" />
            </div>
          ) : mediaSrc ? (
            <img src={mediaSrc} alt="Property media" className="w-full h-64 md:h-72 object-cover" />
          ) : (
            <div className="flex items-center justify-center h-64 md:h-72 border-2 border-dashed border-gray-200 text-[var(--color-dark)]">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 13l3-3 4 4 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-3">Image / Video placeholder</span>
            </div>
          )}
        </div>

        <div className="md:col-span-7 bg-transparent">
          <div className="px-2 md:px-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--color-darkest)] text-center">Interested in this property?</h3>
            <p className="mt-2 text-sm text-[var(--color-darker)] max-w-xl text-center">Quick actions to get started — submit an application, schedule a self-guided tour, check availability, or read FAQs. Everything you need to move forward is just one click away.</p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

              <button onClick={() => handle(onApply, "/apply")} aria-label="Submit application" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-[var(--color-secondary)] text-white shadow-md hover:bg-[var(--color-darker)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Submit Application
              </button>

              <button onClick={() => handle(onTour, "/tour")} aria-label="Schedule tour" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-white hover:bg-[var(--color-secondary)] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                Schedule Self-Guided Tour
              </button>

              <button onClick={() => handle(onAvailability, "/availability")} aria-label="View availability" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-[var(--color-tan)] text-[var(--color-darkest)] hover:bg-[var(--color-light-brown)] transition-colors focus:outline-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M8 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                View Availability
              </button>

              <button onClick={() => handle(onFaqs, "/faqs")} aria-label="Read faqs" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-transparent text-[var(--color-darkest)] border border-transparent hover:underline focus:outline-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2.5-3 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                FAQs
              </button>

            </div>

            <div className="mt-4 text-xs text-[var(--color-darker)] text-center">You can complete the application online — typical processing time is 24–72 hours. For immediate questions, use the contact option in the header.</div>
          </div>
        </div>

      </div>
    </section>
  );
}
