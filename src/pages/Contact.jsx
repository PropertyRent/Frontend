import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from "react-icons/fi";
import ContactService from "../services/contactService";
import toast from "react-hot-toast";

/**
 * ContactPage.jsx
 * - Integrated with backend contact service
 * - Uses only Tailwind classes (no inline style props)
 * - Reads theme CSS vars via Tailwind arbitrary values like bg-[var(--color-bg)]
 */

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Please enter a valid email.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!validate()) return;

    setStatus({ loading: true, ok: null, msg: "" });

    try {
      const contactData = {
        full_name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      };

      const response = await ContactService.submitContact(contactData);

      if (response.success) {
        setStatus({
          loading: false,
          ok: true,
          msg: response.message || "Your message has been sent successfully!",
        });
        setForm({ name: "", email: "", message: "" });
        setErrors({});
        toast.success("Message sent successfully! We'll get back to you soon.");
      } else {
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      const errorMsg =
        error.message || "Failed to send message. Please try again.";
      setStatus({ loading: false, ok: false, msg: errorMsg });
      toast.error(errorMsg);
    }
  }

  const inputClasses =
    "w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 " +
    "border-[var(--color-secondary)] bg-white placeholder:opacity-70";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg)] text-[var(--color-darkest)]">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Get in touch
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[var(--color-darker)]">
            Have questions about a property or want to list with PropertyRent?
            Drop us a message or reach out via call/email — we’ll reply as soon
            as possible.
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
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-[var(--color-darker)]">
                    PO box 17, Watertown, NY 13601
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="p-3 rounded-lg border border-[var(--color-dark)]">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+13158340010"
                    className="text-sm block mt-1 hover:underline text-[var(--color-accent)]"
                  >
                    (315) 834-0010
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg border border-[var(--color-dark)]">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:admin@gmprentals.com"
                    className="text-sm block mt-1 hover:underline text-[var(--color-accent)]"
                  >
                    admin@gmprentals.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map: replace src with real embed */}
            <div className="overflow-hidden rounded-2xl h-64 shadow-sm border border-[var(--color-secondary)]">
              <iframe
                width="600"
                height="450"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9511.045800440756!2d-75.9377668!3d43.9830887!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d87028d9af5981%3A0x7c97e9ecac8fc053!2sPo%20Valley%20Rd%2C%20Watertown%2C%20NY%2013601!5e0!3m2!1sen!2sus!4v1696500000000!5m2!1sen!2sus"
              />
            </div>

            <div className="text-sm text-[var(--color-darker)]">
              <p>
                Office hours:{" "}
                <span className="font-medium">Mon–Fri, 9:00 AM — 6:00 PM</span>
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
                      onChange={(e) =>
                        setForm((s) => ({ ...s, name: e.target.value }))
                      }
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
                      onChange={(e) =>
                        setForm((s) => ({ ...s, email: e.target.value }))
                      }
                      className={`${inputClasses} mt-1 focus:ring-[3px] focus:ring-[var(--color-accent)]`}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
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
                    <span className="text-sm font-medium">Message</span>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, message: e.target.value }))
                      }
                      rows={6}
                      className={`${inputClasses} mt-1 resize-y focus:ring-[3px] focus:ring-[var(--color-accent)]`}
                      placeholder="Tell us about your requirements..."
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="mt-1 text-xs text-red-600"
                      >
                        {errors.message}
                      </p>
                    )}
                  </label>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all
                               bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white shadow-lg hover:shadow-xl disabled:opacity-70 cursor-pointer"
                    aria-busy={status.loading}
                  >
                    <FiSend className="w-4 h-4" />
                    {status.loading ? "Sending..." : "Send message"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm({ name: "", email: "", message: "" });
                      setErrors({});
                      setStatus({ loading: false, ok: null, msg: "" });
                    }}
                    className="px-4 py-2 rounded-full border font-medium border-[var(--color-secondary)] text-[var(--color-secondary)] bg-white hover:bg-[var(--color-light)] transition-colors cursor-pointer"
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
                  <a
                    href="tel:+911234567890"
                    className="font-medium text-[var(--color-accent)]"
                  >
                    (315) 834-0010
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
            <strong className="text-[var(--color-accent)]">
              free 15-min consult
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
