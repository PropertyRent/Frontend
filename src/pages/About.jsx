import React from "react";
import { FiMail, FiMapPin, FiGlobe } from "react-icons/fi";
import { OurTeam } from "../components/OurTeam";

// AboutPage component (default export)
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-darkest)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero / Intro */}
        <section className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">About PropertyRent</h1>
          <p className="max-w-3xl mx-auto text-[var(--color-darker)]">
            PropertyRent connects tenants and landlords with a focus on trust, simplicity and a
            nature-inspired design — blue water accents, soft cloud backgrounds and warm wood tones.
            We help people find homes they love and make listing properties effortless.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 border border-[var(--color-tan)]/30 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p className="text-[var(--color-darker)]">
              Make renting transparent and simple. We provide verified listings, easy communication
              tools and responsive support so renters and owners can transact with confidence.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-darker)]">
              <li>• Verified property listings</li>
              <li>• Fast direct communication</li>
              <li>• Helpful support & local insights</li>
            </ul>
          </div>

          <div className="rounded-2xl p-6 border border-[var(--color-tan)]/30 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-2">How we work</h2>
            <p className="text-[var(--color-darker)]">
              We combine a simple UI, robust backend workflows, and human support. Listings are
              reviewed, and we provide tools for scheduling visits, messaging, and secure payments.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-[var(--color-tan)]">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Local Listings</div>
                  <div className="text-xs text-[var(--color-darker)]">Curated by city</div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <div className="p-3 rounded-full bg-[var(--color-tan)]">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Support</div>
                  <div className="text-xs text-[var(--color-darker)]">Fast email & phone help</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team component */}
        <section>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-6">Our Team</h2>
          <OurTeam />
        </section>

        {/* Footer mini info */}
        <section className="text-center text-sm text-[var(--color-darker)]">
          <p>PropertyRent • Built with care • © {new Date().getFullYear()}</p>
        </section>
      </div>
    </div>
  );
}