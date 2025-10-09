import React from "react";
import { FiTool, FiBriefcase, FiHome, FiShield, FiCalendar, FiDollarSign } from "react-icons/fi";

// ManagementPage.jsx
// Uses only Tailwind classes and theme CSS variables
export default function ManagementPage() {
  const services = [
    {
      title: "Property Management",
      desc: "End-to-end property care: tenant onboarding, inspections, and maintenance coordination.",
      icon: <FiHome className="w-6 h-6" />,
    },
    {
      title: "Maintenance & Repairs",
      desc: "Trusted vendors, emergency repairs and routine upkeep to keep properties in top shape.",
      icon: <FiTool className="w-6 h-6" />,
    },
    {
      title: "Leasing & Marketing",
      desc: "Professional listings, photography, and marketing to reduce vacancy time.",
      icon: <FiBriefcase className="w-6 h-6" />,
    },
    {
      title: "Legal & Compliance",
      desc: "Lease templates, local compliance checks and help with dispute resolution.",
      icon: <FiShield className="w-6 h-6" />,
    },
    {
      title: "Rent Collection",
      desc: "Automated invoicing, reminders, and secure collection with transparent reporting.",
      icon: <FiDollarSign className="w-6 h-6" />,
    },
    {
      title: "Scheduling & Inspections",
      desc: "Regular inspections, move-in/move-out walkthroughs and appointment management.",
      icon: <FiCalendar className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-darkest)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Management & Services</h1>
        </header>

        {/* Services grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <article
                key={s.title}
                className="group rounded-2xl p-6 bg-white border border-[var(--color-secondary)] shadow-sm transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-secondary)] ring-2 ring-white">
                    <div className="text-white">{s.icon}</div>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-darkest)]">{s.title}</h3>
                </div>

                <p className="mt-4 text-sm text-[var(--color-darker)]">{s.desc}</p>

              </article>
            ))}
          </div>
        </section>

       

        {/* Bottom CTA */}
        <section className="text-center">
          <div className="mt-6">
            <a
              href="/contact"
              className="inline-block px-6 py-3 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white font-semibold shadow-lg hover:scale-105 transform transition-all"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
