import axios from "axios";
import { useState, useRef, useEffect } from "react";
import {
  FiHome,
  FiPlusCircle,
  FiLogOut,
  FiImage,
  FiSearch,
  FiSettings,
} from "react-icons/fi";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    beds: 1,
    baths: 1,
    area: "",
    type: "Apartment",
    status: "Available",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [query, setQuery] = useState("");

  const appURL = import.meta.env.VITE_APP_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const logoutAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${appURL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("adminUser");
      console.log("Logout successful:", res.data);
      navigate("/owner-login");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  function handleFileSelect(e) {
    const files = Array.from(e.target.files || []);
    const combined = [...images, ...files].slice(0, 8);
    setImages(combined);
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function resetForm() {
    setForm({
      title: "",
      price: "",
      location: "",
      beds: 1,
      baths: 1,
      area: "",
      type: "Apartment",
      status: "Available",
      description: "",
    });
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // if (!form.title || !form.price || !form.location) {
    //   alert("Please fill title, price and location.");
    //   return;
    // }

    // const fd = new FormData();
    // Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    // images.forEach((file) => fd.append("images", file, file.name));

    // try {
    //   const newProp = {
    //     id: Date.now(),
    //     ...form,
    //     images: imagePreviews,
    //     createdAt: new Date().toLocaleString(),
    //   };
    //   setProperties((p) => [newProp, ...p]);
    //   resetForm();
    //   alert(
    //     "Property added (local demo). Replace the mocked section with your API call."
    //   );
    // } catch (err) {
    //   console.error(err);
    //   alert("Failed to add property. See console.");
    // }
  }

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans">
      <div className="flex bg-[var(--color-bg)]">
        <aside
          className={`transition-all duration-200 p-6 h-screen ${
            sidebarOpen ? "w-62" : "w-22"
          } bg-[var(--color-darkest)] text-[var(--color-bg)] font-semibold font-code`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-accent)] font-bold bg-[var(--color-bg)]">
                PR
              </div>
              {sidebarOpen && (
                <h1 className="text-xl font-bold">PropertyRent</h1>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <a className="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-darker)] cursor-pointer">
              <FiSettings className="text-xl" />{" "}
              {sidebarOpen && <span className="text-lg">Dashboard</span>}
            </a>
            <a className="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-darker)] cursor-pointer">
              <FiPlusCircle className="text-xl" />{" "}
              {sidebarOpen && <span className="text-lg">Add Property</span>}
            </a>
            <Link to="/" className="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-darker)] cursor-pointer">
              <FiHome className="text-xl" />{" "}
              {sidebarOpen && <span className="text-lg">Home</span>}
            </Link>
            <div className="mt-auto pt-6">
              <Link to="#" onClick={logoutAdmin} className="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-darker)] cursor-pointer">
                <FiLogOut className="text-xl" />{" "}
                {sidebarOpen && <span className="text-lg">Sign out</span>}
              </Link>
            </div>
          </nav>
        </aside>
        <button
          className="p-1 h-10 rounded-br hover:opacity-90 bg-[var(--color-darkest)] text-[var(--color-bg)] cursor-pointer"
          onClick={() => setSidebarOpen((s) => !s)}
          title="Toggle sidebar"
        >
          {sidebarOpen ? <IoMdArrowDropleft /> : <IoMdArrowDropright />}
        </button>

        <main className="flex-1 p-8 bg-[var(--color-bg)] max-h-screen overflow-auto">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-[var(--color-darkest)]">
                Admin Dashboard
              </h2>
              <span className="text-sm text-[var(--color-dark)]">
                Manage properties and images
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or location"
                  className="pl-10 pr-3 py-2 rounded-lg border border-[color:var(--color-secondary)]"
                />
                <FiSearch className="absolute left-3 top-2 text-lg text-gray-500" />
              </div>
              <div className="text-sm text-[var(--color-dark)]">
                Signed in as <strong>admin@example.com</strong>
              </div>
            </div>
          </header>

          <section className="grid md:grid-cols-2 gap-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold mb-4">
                Add / Edit Property
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1 block">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Price ($)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Area (sq ft)</label>
                  <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Beds</label>
                  <input
                    name="beds"
                    type="number"
                    min={0}
                    value={form.beds}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Baths</label>
                  <input
                    name="baths"
                    type="number"
                    min={0}
                    value={form.baths}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  />
                </div>

                <div>
                  <label className="text-sm mb-1 block">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  >
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Studio</option>
                    <option>Shop</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm mb-1 block">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                  >
                    <option>Available</option>
                    <option>Rented</option>
                    <option>Hold</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm mb-1 block">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 rounded border border-[color:var(--color-secondary)]"
                />
              </div>

              <div className="mt-4">
                <label className="text-sm mb-1 block">Images (max 8)</label>
                <div className="flex gap-3 items-center">
                  <label className="flex items-center gap-2 p-2 rounded cursor-pointer bg-[var(--color-primary)]">
                    <FiImage /> <span className="text-sm">Upload images</span>
                    <input
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  <div className="text-sm text-gray-500">
                    {images.length} selected
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative rounded overflow-hidden border"
                      >
                        <img
                          src={src}
                          alt={`preview-${i}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          onClick={() => removeImage(i)}
                          type="button"
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded shadow text-white bg-[var(--color-accent)]"
                >
                  Save property
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded border border-[color:var(--color-secondary)]"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="bg-white p-6 rounded-xl shadow-md overflow-auto max-h-[640px]">
              <h3 className="text-lg font-semibold mb-4">Properties</h3>

              {filtered.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No properties yet. Add some from the left.
                </div>
              ) : (
                <ul className="space-y-4">
                  {filtered.map((p) => (
                    <li
                      key={p.id}
                      className="flex gap-4 items-center p-3 rounded border border-[color:var(--color-secondary)]"
                    >
                      <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden">
                        {p.images && p.images[0] ? (
                          <img
                            src={p.images[0]}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{p.title}</div>
                            <div className="text-sm text-gray-500">
                              {p.location}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{p.price}</div>
                            <div className="text-xs text-gray-500">
                              {p.createdAt}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {p.description?.slice(0, 100) || "—"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <footer className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} PropertyRent — Admin Panel
          </footer>
        </main>
      </div>
    </div>
  );
}
