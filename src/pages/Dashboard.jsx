import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import {
  FiHome,
  FiPlusCircle,
  FiLogOut,
  FiImage,
  FiSearch,
  FiSettings,
  FiUsers,
  FiFileText,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSave,
  FiX,
  FiPlus
} from "react-icons/fi";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../stores/authStore";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Modern Downtown Apartment",
      price: "2500",
      location: "Downtown, NYC",
      beds: 2,
      baths: 2,
      area: "1200",
      type: "Apartment",
      status: "Available",
      description: "Beautiful modern apartment with city views",
      images: ["/Home1.jpg"],
      createdAt: "2025-09-15",
      amenities: ["Gym", "Pool", "Parking", "Laundry"]
    },
    {
      id: 2,
      title: "Cozy Studio Near Park",
      price: "1800",
      location: "Central Park, NYC",
      beds: 1,
      baths: 1,
      area: "800",
      type: "Studio",
      status: "Rented",
      description: "Charming studio apartment near Central Park",
      images: ["/Home2.jpg"],
      createdAt: "2025-09-10",
      amenities: ["Gym", "Doorman", "Rooftop"]
    }
  ]);
  
  const [applications, setApplications] = useState([
    {
      id: 1,
      applicantName: "John Smith",
      email: "john@example.com",
      propertyTitle: "Modern Downtown Apartment",
      status: "Pending Review",
      submittedAt: "2025-09-20",
      moveInDate: "2025-10-15",
      peopleCount: 2,
      pets: "1 Golden Retriever",
      jobDuration: "3 years",
      phone: "(555) 123-4567"
    },
    {
      id: 2,
      applicantName: "Sarah Johnson",
      email: "sarah@example.com",
      propertyTitle: "Cozy Studio Near Park",
      status: "Approved",
      submittedAt: "2025-09-18",
      moveInDate: "2025-10-01",
      peopleCount: 1,
      pets: "No pets",
      jobDuration: "2 years",
      phone: "(555) 987-6543"
    }
  ]);

  const [preScreeningQuestions, setPreScreeningQuestions] = useState([
    {
      id: 1,
      question: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
      options: []
    },
    {
      id: 2,
      question: "Email",
      type: "email",
      required: true,
      placeholder: "Enter your email",
      options: []
    },
    {
      id: 3,
      question: "How many people will be moving in?",
      type: "number",
      required: true,
      placeholder: "Number of people",
      options: []
    },
    {
      id: 4,
      question: "Do you have any pets? If so, what are the breeds and how many?",
      type: "textarea",
      required: false,
      placeholder: "Please describe your pets (breed, number, etc.) or write 'No pets'",
      options: []
    },
    {
      id: 5,
      question: "How soon are you looking to move in?",
      type: "date",
      required: true,
      placeholder: "",
      options: []
    },
    {
      id: 6,
      question: "How long have you been at your current job?",
      type: "text",
      required: true,
      placeholder: "e.g., 2 years, 6 months",
      options: []
    },
    {
      id: 7,
      question: "Will there be any issues making the 1st month rent + deposit before move in?",
      type: "textarea",
      required: true,
      placeholder: "Please explain any potential issues or write 'No issues'",
      options: []
    },
    {
      id: 8,
      question: "Have you ever been sent to collections for not paying your bills?",
      type: "select",
      required: true,
      placeholder: "Please select an option",
      options: [
        "No, never",
        "Yes, but it's been resolved",
        "Yes, and it's still ongoing",
        "Prefer not to say"
      ]
    }
  ]);

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
    amenities: ""
  });

  const [questionForm, setQuestionForm] = useState({
    question: "",
    type: "text",
    required: true,
    placeholder: "",
    options: []
  });

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [query, setQuery] = useState("");

  const { logoutAdmin, navigate, user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  // Property Management Functions
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

  function handleQuestionChange(e) {
    const { name, value } = e.target;
    setQuestionForm((f) => ({ ...f, [name]: value }));
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
      amenities: ""
    });
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = null;
  }

  function resetQuestionForm() {
    setQuestionForm({
      question: "",
      type: "text",
      required: true,
      placeholder: "",
      options: []
    });
    setEditingQuestion(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.price || !form.location) {
      alert("Please fill title, price and location.");
      return;
    }

    try {
      const newProp = {
        id: Date.now(),
        ...form,
        images: imagePreviews.length > 0 ? imagePreviews : ["/Home1.jpg"],
        createdAt: new Date().toISOString().split('T')[0],
        amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()) : []
      };
      setProperties((p) => [newProp, ...p]);
      resetForm();
      alert("Property added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add property. See console.");
    }
  }

  function deleteProperty(id) {
    if (confirm("Are you sure you want to delete this property?")) {
      setProperties(prev => prev.filter(p => p.id !== id));
    }
  }

  function updateApplicationStatus(applicationId, newStatus) {
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  }

  // Pre-Screening Questions Functions
  function handleQuestionSubmit(e) {
    e.preventDefault();
    if (!questionForm.question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (editingQuestion) {
      setPreScreeningQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...questionForm, id: editingQuestion.id }
          : q
      ));
      alert("Question updated successfully!");
    } else {
      const newQuestion = {
        id: Date.now(),
        ...questionForm,
        options: questionForm.type === 'select' ? questionForm.options : []
      };
      setPreScreeningQuestions(prev => [...prev, newQuestion]);
      alert("Question added successfully!");
    }
    
    resetQuestionForm();
  }

  function editQuestion(question) {
    setQuestionForm(question);
    setEditingQuestion(question);
  }

  function deleteQuestion(id) {
    if (confirm("Are you sure you want to delete this question?")) {
      setPreScreeningQuestions(prev => prev.filter(q => q.id !== id));
    }
  }

  function addOption() {
    const option = prompt("Enter option text:");
    if (option && option.trim()) {
      setQuestionForm(prev => ({
        ...prev,
        options: [...prev.options, option.trim()]
      }));
    }
  }

  function removeOption(index) {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  }

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location.toLowerCase().includes(query.toLowerCase())
  );

  const stats = {
    totalProperties: properties.length,
    availableProperties: properties.filter(p => p.status === "Available").length,
    rentedProperties: properties.filter(p => p.status === "Rented").length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === "Pending Review").length,
    approvedApplications: applications.filter(a => a.status === "Approved").length
  };

  // Navigation items
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: FiBarChart2 },
    { key: "properties", label: "Properties", icon: FiHome },
    { key: "applications", label: "Applications", icon: FiUsers },
    { key: "pre-screening", label: "Pre-Screening", icon: FiFileText },
    { key: "settings", label: "Settings", icon: FiSettings }
  ];

  return (
    <div className="min-h-screen font-sans bg-[var(--color-bg)]">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-200 h-screen sticky top-0 ${
            sidebarOpen ? "w-64" : "w-23"
          } bg-[var(--color-darker)] text-[var(--color-bg)] shadow-xl`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--color-secondary)] font-bold bg-[var(--color-bg)]">
                PR
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold">PropertyRent</h1>
                  <p className="text-sm opacity-70">Admin Panel</p>
                </div>
              )}
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeSection === item.key
                        ? "bg-[var(--color-secondary)] text-white"
                        : "hover:bg-[var(--color-dark)]"
                    }`}
                  >
                    <Icon className="text-xl flex-shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                );
              })}
              
              <div className="pt-6 mt-6 border-t border-[var(--color-dark)]">
                <Link
                  to="/"
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--color-dark)] transition-colors"
                >
                  <FiHome className="text-xl flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">Back to Site</span>}
                </Link>
                <button
                  onClick={logoutAdmin}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-600/20 text-red-400 transition-colors"
                >
                  <FiLogOut className="text-xl flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">Sign out</span>}
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Toggle Button */}
        <button
          className="py-2 bg-[var(--color-darker)] text-[var(--color-bg)] rounded-r-full hover:opacity-90 transition-opacity"
          onClick={() => setSidebarOpen((s) => !s)}
          title="Toggle sidebar"
          style={{ left: sidebarOpen ? '256px' : '83px' }}
        >
          {sidebarOpen ? <IoMdArrowDropleft className="text-xl" /> : <IoMdArrowDropright className="text-xl" />}
        </button>

        {/* Main Content */}
        <main className="flex-1 max-h-screen overflow-auto">
          <div className="p-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-darkest)]">
                  {navItems.find(item => item.key === activeSection)?.label || "Dashboard"}
                </h1>
                <p className="text-[var(--color-muted)] mt-1">
                  {activeSection === "dashboard" && "Overview of your property management"}
                  {activeSection === "properties" && "Manage your property listings"}
                  {activeSection === "applications" && "Review tenant applications"}
                  {activeSection === "pre-screening" && "Manage pre-screening questions"}
                  {activeSection === "settings" && "Configure your preferences"}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {(activeSection === "properties" || activeSection === "applications") && (
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
                  </div>
                )}
                <div className="text-sm text-[var(--color-muted)]">
                  Welcome back, <strong className="text-[var(--color-darkest)]">Admin</strong>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            {activeSection === "dashboard" && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--color-muted)]">Total Properties</p>
                        <p className="text-3xl font-bold text-[var(--color-darkest)]">{stats.totalProperties}</p>
                      </div>
                      <FiHome className="text-3xl text-[var(--color-secondary)]" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--color-muted)]">Available</p>
                        <p className="text-3xl font-bold text-green-600">{stats.availableProperties}</p>
                      </div>
                      <FiCheckCircle className="text-3xl text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[var(--color-muted)]">Applications</p>
                        <p className="text-3xl font-bold text-[var(--color-secondary)]">{stats.totalApplications}</p>
                      </div>
                      <FiUsers className="text-3xl text-[var(--color-secondary)]" />
                    </div>
                  </div>
                </div>

                {/* Recent Properties & Applications */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">Recent Properties</h3>
                    <div className="space-y-3">
                      {properties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-bg)]">
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-[var(--color-darkest)]">{property.title}</h4>
                            <p className="text-sm text-[var(--color-muted)]">${property.price}/month</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.status === 'Available' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">Recent Applications</h3>
                    <div className="space-y-3">
                      {applications.slice(0, 3).map((app) => (
                        <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-bg)]">
                          <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white font-semibold">
                            {app.applicantName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-[var(--color-darkest)]">{app.applicantName}</h4>
                            <p className="text-sm text-[var(--color-muted)]">{app.propertyTitle}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === 'Approved' 
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'Pending Review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Properties Section */}
            {activeSection === "properties" && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Add Property Form */}
                  <div className="lg:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                      <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">Add Property</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Title</label>
                          <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            placeholder="Property title"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Price ($)</label>
                            <input
                              name="price"
                              value={form.price}
                              onChange={handleChange}
                              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                              placeholder="Monthly rent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Area (sq ft)</label>
                            <input
                              name="area"
                              value={form.area}
                              onChange={handleChange}
                              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                              placeholder="Square feet"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Location</label>
                          <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            placeholder="City, State"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Beds</label>
                            <input
                              name="beds"
                              type="number"
                              min="0"
                              value={form.beds}
                              onChange={handleChange}
                              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Baths</label>
                            <input
                              name="baths"
                              type="number"
                              min="0"
                              value={form.baths}
                              onChange={handleChange}
                              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Type</label>
                            <select
                              name="type"
                              value={form.type}
                              onChange={handleChange}
                              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            >
                              <option>Apartment</option>
                              <option>House</option>
                              <option>Studio</option>
                              <option>Condo</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Status</label>
                          <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                          >
                            <option>Available</option>
                            <option>Rented</option>
                            <option>Hold</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Amenities (comma separated)</label>
                          <input
                            name="amenities"
                            value={form.amenities}
                            onChange={handleChange}
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            placeholder="Gym, Pool, Parking"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Description</label>
                          <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            placeholder="Property description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Images (max 8)</label>
                          <label className="flex items-center gap-2 p-3 border-2 border-dashed border-[var(--color-tan)] rounded-lg cursor-pointer hover:border-[var(--color-secondary)] transition-colors">
                            <FiImage className="text-[var(--color-muted)]" />
                            <span className="text-sm text-[var(--color-muted)]">
                              {images.length > 0 ? `${images.length} files selected` : "Upload images"}
                            </span>
                            <input
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                            />
                          </label>

                          {imagePreviews.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              {imagePreviews.map((src, i) => (
                                <div key={i} className="relative rounded-lg overflow-hidden">
                                  <img src={src} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                                  <button
                                    onClick={() => removeImage(i)}
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                  >
                                    <FiX className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="submit"
                          className="flex-1 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          <FiSave className="inline mr-2" />
                          Save Property
                        </button>
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-4 py-3 border border-[var(--color-tan)] rounded-lg hover:bg-[var(--color-light)] transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Properties List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
                      <div className="p-6 border-b border-[var(--color-tan)]/20">
                        <h3 className="text-lg font-semibold text-[var(--color-darkest)]">Properties ({filtered.length})</h3>
                      </div>
                      <div className="max-h-[600px] overflow-y-auto">
                        {filtered.length === 0 ? (
                          <div className="p-8 text-center text-[var(--color-muted)]">
                            <FiHome className="mx-auto text-4xl mb-4 opacity-50" />
                            <p>No properties found. Add some properties to get started.</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-[var(--color-tan)]/20">
                            {filtered.map((property) => (
                              <div key={property.id} className="p-6 hover:bg-[var(--color-bg)] transition-colors">
                                <div className="flex gap-4">
                                  <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-20 h-20 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold text-[var(--color-darkest)]">{property.title}</h4>
                                      <div className="flex gap-2">
                                        <button className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white rounded-lg transition-colors">
                                          <FiEdit3 className="w-4 h-4" />
                                        </button>
                                        <button 
                                          onClick={() => deleteProperty(property.id)}
                                          className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                        >
                                          <FiTrash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-[var(--color-muted)] mb-2">
                                      <div className="flex items-center gap-1">
                                        <FiMapPin className="w-4 h-4" />
                                        {property.location}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FiDollarSign className="w-4 h-4" />
                                        ${property.price}/month
                                      </div>
                                      <div>{property.beds} beds, {property.baths} baths</div>
                                      <div>{property.area} sq ft</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        property.status === 'Available' 
                                          ? 'bg-green-100 text-green-800'
                                          : property.status === 'Rented'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {property.status}
                                      </span>
                                      <span className="text-xs text-[var(--color-muted)]">Added {property.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Section */}
            {activeSection === "applications" && (
              <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
                <div className="p-6 border-b border-[var(--color-tan)]/20">
                  <h3 className="text-lg font-semibold text-[var(--color-darkest)]">Applications ({applications.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[var(--color-bg)]">
                      <tr>
                        <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Applicant</th>
                        <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Property</th>
                        <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Move-in Date</th>
                        <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Status</th>
                        <th className="text-left p-4 font-medium text-[var(--color-darkest)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-tan)]/20">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-[var(--color-bg)] transition-colors">
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-[var(--color-darkest)]">{app.applicantName}</div>
                              <div className="text-sm text-[var(--color-muted)] flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <FiMail className="w-3 h-3" />
                                  {app.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiPhone className="w-3 h-3" />
                                  {app.phone}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-[var(--color-darkest)]">{app.propertyTitle}</div>
                            <div className="text-sm text-[var(--color-muted)]">{app.peopleCount} people, {app.pets}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-[var(--color-darkest)]">
                              <FiCalendar className="w-4 h-4" />
                              {app.moveInDate}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              app.status === 'Approved' 
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'Pending Review'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'Approved')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <FiCheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <FiXCircle className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-light)] rounded-lg transition-colors">
                                <FiEye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pre-Screening Questions Section */}
            {activeSection === "pre-screening" && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Add Question Form */}
                  <div className="lg:col-span-1">
                    <form onSubmit={handleQuestionSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                      <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">
                        {editingQuestion ? 'Edit Question' : 'Add Question'}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Question Text</label>
                          <input
                            name="question"
                            value={questionForm.question}
                            onChange={handleQuestionChange}
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            placeholder="Enter your question"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Input Type</label>
                          <select
                            name="type"
                            value={questionForm.type}
                            onChange={handleQuestionChange}
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select Dropdown</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Placeholder Text</label>
                          <input
                            name="placeholder"
                            value={questionForm.placeholder}
                            onChange={handleQuestionChange}
                            className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                            placeholder="Placeholder text (optional)"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="required"
                            checked={questionForm.required}
                            onChange={(e) => setQuestionForm(prev => ({ ...prev, required: e.target.checked }))}
                            className="rounded border-[var(--color-tan)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)]"
                          />
                          <label className="text-sm text-[var(--color-darkest)]">Required field</label>
                        </div>

                        {questionForm.type === 'select' && (
                          <div>
                            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-2">Options</label>
                            <div className="space-y-2">
                              {questionForm.options.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...questionForm.options];
                                      newOptions[index] = e.target.value;
                                      setQuestionForm(prev => ({ ...prev, options: newOptions }));
                                    }}
                                    className="flex-1 p-2 border border-[var(--color-tan)]/50 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]"
                                    placeholder="Option text"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={addOption}
                                className="flex items-center gap-2 p-2 text-[var(--color-secondary)] hover:bg-[var(--color-light)] rounded transition-colors"
                              >
                                <FiPlus className="w-4 h-4" />
                                Add Option
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          type="submit"
                          className="flex-1 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white py-3 px-4 rounded-lg font-medium transition-colors"
                        >
                          <FiSave className="inline mr-2" />
                          {editingQuestion ? 'Update Question' : 'Add Question'}
                        </button>
                        {editingQuestion && (
                          <button
                            type="button"
                            onClick={resetQuestionForm}
                            className="px-4 py-3 border border-[var(--color-tan)] rounded-lg hover:bg-[var(--color-light)] transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Questions List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
                      <div className="p-6 border-b border-[var(--color-tan)]/20">
                        <h3 className="text-lg font-semibold text-[var(--color-darkest)]">
                          Screening Questions ({preScreeningQuestions.length})
                        </h3>
                        <p className="text-sm text-[var(--color-muted)] mt-1">
                          These questions will appear on the pre-screening form
                        </p>
                      </div>
                      <div className="max-h-[600px] overflow-y-auto">
                        {preScreeningQuestions.length === 0 ? (
                          <div className="p-8 text-center text-[var(--color-muted)]">
                            <FiFileText className="mx-auto text-4xl mb-4 opacity-50" />
                            <p>No questions added yet. Create your first screening question.</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-[var(--color-tan)]/20">
                            {preScreeningQuestions.map((question, index) => (
                              <div key={question.id} className="p-6 hover:bg-[var(--color-bg)] transition-colors">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-sm font-medium text-[var(--color-secondary)] bg-[var(--color-light)] px-2 py-1 rounded">
                                        #{index + 1}
                                      </span>
                                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">
                                        {question.type}
                                      </span>
                                      {question.required && (
                                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="font-medium text-[var(--color-darkest)] mb-2">{question.question}</h4>
                                    {question.placeholder && (
                                      <p className="text-sm text-[var(--color-muted)] mb-2">
                                        Placeholder: "{question.placeholder}"
                                      </p>
                                    )}
                                    {question.options && question.options.length > 0 && (
                                      <div className="text-sm text-[var(--color-muted)]">
                                        Options: {question.options.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => editQuestion(question)}
                                      className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white rounded-lg transition-colors"
                                    >
                                      <FiEdit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteQuestion(question.id)}
                                      className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
                <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-[var(--color-darkest)] mb-2">Account Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Email</label>
                        <input
                          value="admin@propertyrent.com"
                          disabled
                          className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Role</label>
                        <input
                          value="Administrator"
                          disabled
                          className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[var(--color-darkest)] mb-2">Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-[var(--color-tan)] text-[var(--color-secondary)]" />
                        <span className="text-sm text-[var(--color-darkest)]">Email notifications for new applications</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-[var(--color-tan)] text-[var(--color-secondary)]" />
                        <span className="text-sm text-[var(--color-darkest)]">SMS notifications for urgent matters</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
