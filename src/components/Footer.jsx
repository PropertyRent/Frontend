import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-light)] text-[var(--color-darker)] border-t border-[var(--color-tan)]/30 pt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 not-md:text-center gap-8 p-4">
        {/* Company Info */}
        <div className="flex flex-col justify-center items-center text-center">
          <img
            src="/Logo_1.png"
            alt="GMP Rentals logo"
            className="w-14 h-14 md:w-20 md:h-20 object-contain rounded-md"
          />
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center items-center w-full text-center">
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-center items-center gap-2">
              <FaEnvelope className="text-[var(--color-darker)]" />{" "}
              admin@gmprentals.com
            </li>
            <li className="flex justify-center items-center gap-2">
              <FaPhoneAlt className="text-[var(--color-darker)]" /> (315)
              834-0010
            </li>
            <li className="flex justify-center items-center gap-2">
              <FaMapMarkerAlt className="text-[var(--color-darker)]" /> PO box
              17, Watertown, NY 13601
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col justify-center items-center text-center">
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link to="/properties" className="hover:underline">
                Properties
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col justify-center items-center ">
          <h3 className="text-xl font-semibold mb-3">Admin Portal</h3>
          <div>
            {localStorage.getItem("adminUser") ? (
              <Link
                to="/admin"
                className="text-sm text-[var(--color-darker)] hover:underline"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/admin-login"
                className="text-sm text-[var(--color-darker)] hover:underline"
              >
                Admin Login
              </Link>
            )}
          </div>
          {/* <h3 className="flex justify-center items-center text-lg font-semibold my-3">Follow Us</h3>
          <div className="flex justify-center gap-3">
            <Link to="#" className="p-2 bg-[var(--color-secondary)] rounded-full hover:bg-[var(--color-darker)] transition-colors">
              <FaFacebookF className="text-white" />
            </Link>
            <Link to="#" className="p-2 bg-[var(--color-secondary)] rounded-full hover:bg-[var(--color-darker)] transition-colors">
              <FaTwitter className="text-white" />
            </Link>
            <Link to="#" className="p-2 bg-[var(--color-secondary)] rounded-full hover:bg-[var(--color-darker)] transition-colors">
              <FaLinkedinIn className="text-white" />
            </Link>
            <Link to="#" className="p-2 bg-[var(--color-secondary)] rounded-full hover:bg-[var(--color-darker)] transition-colors">
              <FaInstagram className="text-white" />
            </Link>
          </div> */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className=" w-full mt-10 border-t bg-[var(--color-darker)] border-[var(--color-tan)]/30 py-8 text-center text-lg text-white">
        © {new Date().getFullYear()} GMP Rentals. All rights reserved.
      </div>
    </footer>
  );
}
