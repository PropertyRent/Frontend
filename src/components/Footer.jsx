import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] text-[var(--color-light)] border-t pt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Company Name</h2>
          <p className="text-sm text-[var(--color-darker)]">
            Providing reliable real estate solutions to help you find the
            property that feels like home.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[var(--color-darker)]" /> info@example.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[var(--color-darker)]" /> +1 234 567 890
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[var(--color-darker)]" /> 123 Main Street, New York, USA
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/services" className="hover:underline">
                Services
              </a>
            </li>
            <li>
              <a href="/properties" className="hover:underline">
                Properties
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-3">
            <a href="#" className="p-2 bg-[var(--color-darker)] rounded-full hover:opacity-80">
              <FaFacebookF className="text-[var(--color-bg)]" />
            </a>
            <a href="#" className="p-2 bg-[var(--color-darker)] rounded-full hover:opacity-80">
              <FaTwitter className="text-[var(--color-bg)]" />
            </a>
            <a href="#" className="p-2 bg-[var(--color-darker)] rounded-full hover:opacity-80">
              <FaLinkedinIn className="text-[var(--color-bg)]" />
            </a>
            <a href="#" className="p-2 bg-[var(--color-darker)] rounded-full hover:opacity-80">
              <FaInstagram className="text-[var(--color-bg)]" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className=" w-full mt-10 border-t bg-[var(--color-darker)] border-[var(--color-dark)] py-8 text-center text-lg text-[var(--color-bg)]">
        © {new Date().getFullYear()} Company Name. All rights reserved.
      </div>
    </footer>
  );
}
