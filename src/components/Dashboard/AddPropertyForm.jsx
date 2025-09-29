import { useRef } from "react";
import { FiImage, FiSave, FiX } from "react-icons/fi";

const AddPropertyForm = ({ 
  form, 
  handleChange, 
  handleSubmit, 
  resetForm, 
  images, 
  imagePreviews, 
  handleFileSelect, 
  removeImage 
}) => {
  const fileInputRef = useRef(null);

  return (
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
  );
};

export default AddPropertyForm;