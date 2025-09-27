import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

/**
 * ContactPage.jsx
 * - Uses only Tailwind classes (no inline style props)
 * - Reads theme CSS vars via Tailwind arbitrary values like bg-[var(--color-bg)]
 * - Minimal comments only where useful
 */

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.subject.trim()) e.subject = "Please add a subject.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function handleSubmit(evt) {
    evt.preventDefault();
  }

  const inputClasses =
    "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 " +
    "border-[var(--color-secondary)] bg-white placeholder:opacity-70";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg)] text-[var(--color-darkest)]">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Get in touch</h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--color-darker)]">
            Have questions about a property or want to list with PropertyRent? Drop us a message or
            reach out via call/email — we’ll reply as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info + map */}
          <div className="space-y-6 lg:col-span-1">
            <div
              className={
                "rounded-2xl p-6 border border-[var(--color-light-brown)] "
              }
            >
              <h2 className="text-lg font-semibold mb-4">Contact details</h2>

              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 rounded-lg border border-[var(--color-dark)]">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-sm text-[var(--color-darker)]">24 Riverside Ave, Green Park, Cityname</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 rounded-lg border border-[var(--color-dark)]">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+911234567890" className="text-sm block mt-1 hover:underline text-[var(--color-accent)]">
                    +91 12345 67890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg border border-[var(--color-dark)]">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:hello@propertyrent.example" className="text-sm block mt-1 hover:underline text-[var(--color-accent)]">
                    hello@propertyrent.example
                  </a>
                </div>
              </div>
            </div>

            {/* Map: replace src with real embed */}
            <div className="overflow-hidden rounded-2xl h-64 shadow-sm border border-[var(--color-secondary)]">
              <iframe
                title="office-map"
                src="https://maps.google.com/maps?q=Central%20Park%20NYC&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                aria-hidden="false"
              />
            </div>

            <div className="text-sm text-[var(--color-darker)]">
              <p>
                Office hours: <span className="font-medium">Mon–Fri, 9:00 AM — 6:00 PM</span>
              </p>
              <p className="mt-1">We usually reply within 1 business day.</p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-6 border border-[var(--color-light-brown)] bg-white">
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium">Your name</span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      className={`${inputClasses} mt-1 focus:ring-[3px] focus:ring-[var(--color-accent)]`}
                      placeholder="Jane Doe"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-xs text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      className={`${inputClasses} mt-1 focus:ring-[3px] focus:ring-[var(--color-accent)]`}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="text-sm font-medium">Subject</span>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))}
                      className={`${inputClasses} mt-1 focus:ring-[3px] focus:ring-[var(--color-accent)]`}
                      placeholder="Inquiry about property ID #1234"
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? "subject-error" : undefined}
                    />
                    {errors.subject && (
                      <p id="subject-error" className="mt-1 text-xs text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="text-sm font-medium">Message</span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                      rows={6}
                      className={`${inputClasses} mt-1 resize-y focus:ring-[3px] focus:ring-[var(--color-accent)]`}
                      placeholder="Tell us about your requirements..."
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-1 text-xs text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </label>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-shadow
                               bg-[var(--color-accent)] text-white shadow-lg hover:shadow-xl disabled:opacity-70 cursor-pointer"
                    aria-busy={status.loading}
                  >
                    <FiSend className="w-4 h-4" />
                    {status.loading ? "Sending..." : "Send message"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm({ name: "", email: "", subject: "", message: "" });
                      setErrors({});
                      setStatus({ loading: false, ok: null, msg: "" });
                    }}
                    className="px-4 py-2 rounded-full border font-medium border-[var(--color-dark)] text-[var(--color-dark)] bg-white cursor-pointer"
                  >
                    Reset
                  </button>

                  <div className="mt-3 sm:mt-0">
                    {status.ok === true && (
                      <p className="text-sm text-green-600" role="status">
                        {status.msg}
                      </p>
                    )}
                    {status.ok === false && (
                      <p className="text-sm text-red-600" role="alert">
                        {status.msg}
                      </p>
                    )}
                  </div>
                </div>
              </form>

              <div className="mt-6 text-sm text-[var(--color-darker)]">
                <p>
                  For urgent inquiries, call us at{" "}
                  <a href="tel:+911234567890" className="font-medium text-[var(--color-accent)]">
                    +91 12345 67890
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-xl p-6 text-center border-dashed border border-[var(--color-light-brown)] bg-[var(--color-bg)]">
          <p className="text-sm">
            Prefer talking? Schedule a call with our agent —{" "}
            <strong className="text-[var(--color-accent)]">free 15-min consult</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
