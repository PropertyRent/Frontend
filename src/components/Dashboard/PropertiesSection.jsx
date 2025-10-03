import { useState, useContext, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiX,
  FiSave,
  FiImage,
} from "react-icons/fi";
import { PropertyContext } from "../../stores/propertyStore";
import PropertyList from "./PropertyList";

const PropertiesSection = () => {
  const {
    properties,
    fetchProperties,
    deleteProperty,
    getPropertiesLoading,
    deletePropertyLoading,
    addProperty,
    addPropertyLoading,
    addPropertyError,
    clearAddPropertyError,
    updateProperty,
    updatePropertyLoading,
    updatePropertyError,
    clearUpdatePropertyError,
  } = useContext(PropertyContext);

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit'
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    property_type: "",
    status: "",
    furnishing: "",
    area_sqft: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    utilities: [],
    amenities: [],
    appliances_included: [],
    lease_term: "",
    application_fee: "",
    pet_policy: "",
    property_management_contact: "",
    website: "",
    price: "",
    deposit: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    available_from: "",
  });

  // Image handling state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Temp state for array fields
  const [utilities_temp, setUtilitiesTemp] = useState("");
  const [amenities_temp, setAmenitiesTemp] = useState("");
  const [appliances_temp, setAppliancesTemp] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  // Modal handlers
  const openAddModal = () => {
    resetForm();
    setModalMode("add");
    setShowModal(true);
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    populateEditForm(property);
    setModalMode("edit");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
    resetForm();
    if (addPropertyError) clearAddPropertyError();
    if (updatePropertyError) clearUpdatePropertyError();
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    // Handle empty string
    if (!value || value.trim() === "") {
      handleChange({
        target: {
          name: field,
          value: [],
        },
      });
      return;
    }

    if (field === "utilities") setUtilitiesTemp(value);
    if (field === "amenities") setAmenitiesTemp(value);
    if (field === "appliances_included") setAppliancesTemp(value);

    // Split by comma, trim whitespace, and filter out empty items
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    handleChange({
      target: {
        name: field,
        value: arrayValue,
      },
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      property_type: "",
      status: "",
      furnishing: "",
      area_sqft: "",
      bedrooms: "",
      bathrooms: "",
      floors: "",
      utilities: [],
      amenities: [],
      appliances_included: [],
      lease_term: "",
      application_fee: "",
      pet_policy: "",
      property_management_contact: "",
      website: "",
      price: "",
      deposit: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
      available_from: "",
    });
    setImages([]);
    setImagePreviews([]);
    setExistingImages([]);
    setUtilitiesTemp("");
    setAmenitiesTemp("");
    setAppliancesTemp("");
  };

  const populateEditForm = (property) => {
    setForm({
      title: property.title || "",
      description: property.description || "",
      property_type: property.property_type || "",
      status: property.status || "",
      furnishing: property.furnishing || "",
      area_sqft: property.area_sqft || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      floors: property.floors || "",
      utilities: Array.isArray(property.utilities)
        ? property.utilities
        : property.utilities
        ? property.utilities.split(", ")
        : [],
      amenities: Array.isArray(property.amenities)
        ? property.amenities
        : property.amenities
        ? property.amenities.split(", ")
        : [],
      appliances_included: Array.isArray(property.appliances_included)
        ? property.appliances_included
        : property.appliances_included
        ? property.appliances_included.split(", ")
        : [],
      lease_term: property.lease_term || "",
      application_fee: property.application_fee || "",
      pet_policy: property.pet_policy || "",
      property_management_contact: property.property_management_contact || "",
      website: property.website || "",
      price: property.price || "",
      deposit: property.deposit || "",
      address: property.address || "",
      city: property.city || "",
      state: property.state || "",
      pincode: property.pincode || "",
      latitude: property.latitude || "",
      longitude: property.longitude || "",
      available_from: property.available_from || "",
    });

    // Set temp values for array fields
    setUtilitiesTemp(
      property.utilities
        .join(",")
        .replace(/[\[\]"]/g, "")
        .split(",")
        .join(", ")
    );
    setAmenitiesTemp(
      property.amenities
        .join(",")
        .replace(/[\[\]"]/g, "")
        .split(",")
        .join(", ")
    );
    setAppliancesTemp(
      property.appliances_included
        .join(",")
        .replace(/[\[\]"]/g, "")
        .split(",")
        .join(", ")
    );

    // Set existing images if available
    if (property.images && Array.isArray(property.images)) {
      setExistingImages(property.images);
    } else if (property.media && Array.isArray(property.media)) {
      setExistingImages(property.media.map((media) => media.url));
    }
  };

  // Image handling
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    if (addPropertyError) clearAddPropertyError();
    if (updatePropertyError) clearUpdatePropertyError();

    // Create FormData object
    const formData = new FormData();

    // Add basic property data
    Object.keys(form).forEach((key) => {
      if (form[key] !== "" && form[key] != null) {
        if (Array.isArray(form[key])) {
          formData.append(key, JSON.stringify(form[key]));
        } else {
          formData.append(key, form[key]);
        }
      }
    });

    // Add media files
    if (modalMode === "add") {
      images.forEach((file) => {
        formData.append("media_files", file);
      });
    } else {
      // For edit mode
      images.forEach((file) => {
        formData.append("images", file);
      });

      // Add existing images that weren't removed
      if (existingImages.length > 0) {
        formData.append("existing_images", JSON.stringify(existingImages));
      }
    }

    try {
      let success;
      if (modalMode === "add") {
        success = addProperty(formData);
      } else {
        success = updateProperty(selectedProperty.id, formData);
      }

      if (success) {
        closeModal();
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  // Filter properties
  const filtered = properties.filter((property) => {
    const matchesSearch =
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-darkest)]">
            Properties
          </h2>
          <p className="text-[var(--color-muted)] mt-1">
            Manage your property listings
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FiPlus className="inline mr-2" />
          Add Property
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-[var(--color-muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
              <option value="hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <PropertyList
        filtered={filtered}
        deleteProperty={deleteProperty}
        onEditProperty={openEditModal}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === "add" ? "Add New Property" : "Edit Property"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Error Display */}
              {(addPropertyError || updatePropertyError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {addPropertyError || updatePropertyError}
                </div>
              )}

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Property title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Property description"
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid gap-4 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type *
                    </label>
                    <select
                      name="property_type"
                      value={form.property_type}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Furnishing
                    </label>
                    <select
                      name="furnishing"
                      value={form.furnishing}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Furnishing</option>
                      <option value="furnished">Furnished</option>
                      <option value="semi-furnished">Semi-Furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq ft) *
                    </label>
                    <input
                      name="area_sqft"
                      type="number"
                      value={form.area_sqft}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Square feet"
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms *
                    </label>
                    <input
                      name="bedrooms"
                      type="number"
                      min="0"
                      value={form.bedrooms}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms *
                    </label>
                    <input
                      name="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      value={form.bathrooms}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floors
                    </label>
                    <input
                      name="floors"
                      type="number"
                      min="1"
                      value={form.floors}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Array Fields */}
                <div className="grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Utilities (comma separated)
                    </label>
                    <input
                      name="utilities"
                      value={utilities_temp}
                      onChange={(e) =>
                        handleArrayChange("utilities", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Water, Electricity, Gas, Internet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amenities (comma separated)
                    </label>
                    <input
                      name="amenities"
                      value={amenities_temp}
                      onChange={(e) =>
                        handleArrayChange("amenities", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Gym, Pool, Parking, Laundry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appliances Included (comma separated)
                    </label>
                    <input
                      name="appliances_included"
                      value={appliances_temp}
                      onChange={(e) =>
                        handleArrayChange("appliances_included", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Refrigerator, Stove, Washer, Dryer"
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div className="grid gap-4 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Rent ($) *
                    </label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Monthly rent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Security Deposit ($)
                    </label>
                    <input
                      name="deposit"
                      type="number"
                      step="0.01"
                      value={form.deposit}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Security deposit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lease Term (months)
                    </label>
                    <input
                      name="lease_term"
                      type="number"
                      min="1"
                      value={form.lease_term}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Fee ($)
                    </label>
                    <input
                      name="application_fee"
                      type="number"
                      step="0.01"
                      value={form.application_fee}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Application fee"
                    />
                  </div>
                </div>

                {/* Pet Policy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Policy
                  </label>
                  <select
                    name="pet_policy"
                    value={form.pet_policy}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Pet Policy</option>
                    <option value="no-pets">No Pets</option>
                    <option value="cats-allowed">Cats Allowed</option>
                    <option value="dogs-allowed">Dogs Allowed</option>
                    <option value="pets-allowed">All Pets Allowed</option>
                    <option value="case-by-case">Case by Case</option>
                  </select>
                </div>

                {/* Contact Information */}
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Management Contact
                    </label>
                    <input
                      name="property_management_contact"
                      value={form.property_management_contact}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contact information"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      name="website"
                      type="url"
                      value={form.website}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available From
                    </label>
                    <input
                      name="available_from"
                      type="date"
                      value={form.available_from}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Media Files */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Images
                  </label>

                  {/* Existing Images (for edit mode) */}
                  {modalMode === "edit" && existingImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">
                        Current Images:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {existingImages.map((src, i) => (
                          <div
                            key={i}
                            className="relative rounded-lg overflow-hidden"
                          >
                            <img
                              src={src}
                              alt={`existing-${i}`}
                              className="w-full h-24 object-cover"
                            />
                            <button
                              onClick={() => removeExistingImage(i)}
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <FiX className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <label className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <FiImage className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {images.length > 0
                        ? `${images.length} files selected`
                        : modalMode === "edit"
                        ? "Upload new images"
                        : "Upload images"}
                    </span>
                    <input
                      onChange={handleFileSelect}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                  </label>

                  {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {imagePreviews.map((src, i) => (
                        <div
                          key={i}
                          className="relative rounded-lg overflow-hidden"
                        >
                          <img
                            src={src}
                            alt={`preview-${i}`}
                            className="w-full h-24 object-cover"
                          />
                          <button
                            onClick={() => removeNewImage(i)}
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

              {/* Submit Button */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  type="submit"
                  disabled={addPropertyLoading || updatePropertyLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <FiSave className="inline mr-2" />
                  {modalMode === "add"
                    ? addPropertyLoading
                      ? "Adding Property..."
                      : "Add Property"
                    : updatePropertyLoading
                    ? "Updating Property..."
                    : "Update Property"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={addPropertyLoading || updatePropertyLoading}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesSection;
