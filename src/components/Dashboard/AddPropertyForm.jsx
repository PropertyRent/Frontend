import { useRef, useContext, useState } from "react";
import { FiImage, FiSave, FiX, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { PropertyContext } from "../../stores/propertyStore";

const AddPropertyForm = ({ 
  form, 
  handleChange, 
  resetForm, 
  images, 
  imagePreviews, 
  handleFileSelect, 
  removeImage,
  isExpanded = false,
  onToggleExpansion 
}) => {
  const fileInputRef = useRef(null);
  const { addProperty, addPropertyLoading, addPropertyError, clearAddPropertyError } = useContext(PropertyContext);
  const [utilities_temp, setUtilitiesTemp] = useState(form.utilities ? form.utilities.join(', ') : '');
  const [amenities_temp, setAmenitiesTemp] = useState(form.amenities ? form.amenities.join(', ') : '');
  const [appliances_temp, setAppliancesTemp] = useState(form.appliances_included ? form.appliances_included.join(', ') : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearAddPropertyError();
    
    // Create FormData object
    const formData = new FormData();
    
    // Add basic property data
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('property_type', form.property_type);
    formData.append('status', form.status);
    formData.append('furnishing', form.furnishing);
    formData.append('area_sqft', form.area_sqft);
    formData.append('bedrooms', form.bedrooms);
    formData.append('bathrooms', form.bathrooms);
    formData.append('floors', form.floors);
    formData.append('lease_term', form.lease_term);
    formData.append('application_fee', form.application_fee);
    formData.append('pet_policy', form.pet_policy);
    formData.append('property_management_contact', form.property_management_contact);
    formData.append('website', form.website);
    formData.append('price', form.price);
    formData.append('deposit', form.deposit);
    formData.append('address', form.address);
    formData.append('city', form.city);
    formData.append('state', form.state);
    formData.append('pincode', form.pincode);
    formData.append('latitude', form.latitude);
    formData.append('longitude', form.longitude);
    formData.append('available_from', form.available_from);
    
    // Add array fields as JSON strings
    formData.append('utilities', JSON.stringify(form.utilities || []));
    formData.append('amenities', JSON.stringify(form.amenities || []));
    formData.append('appliances_included', JSON.stringify(form.appliances_included || []));
    
    // Add media files
    images.forEach(file => {
      formData.append('media_files', file);
    });
    
    // Call the addProperty function
    const success = addProperty(formData);
    
    // Reset form if successful
    if (success) {
      resetForm();
    }
  };

  const handleArrayChange = (field, value) => {
    // Handle empty string
    if (!value || value.trim() === '') {
      handleChange({
        target: {
          name: field,
          value: []
        }
      });
      return;
    }
    
    console.log("Original value:", value);
    if(field === 'utilities') setUtilitiesTemp(value);
    if(field === 'amenities') setAmenitiesTemp(value);
    if(field === 'appliances_included') setAppliancesTemp(value);

    // Split by comma, trim whitespace, and filter out empty items
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
    
    console.log("Processed array value:", arrayValue);

    handleChange({
      target: {
        name: field,
        value: arrayValue
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-darkest)]">Add Property</h3>
          {onToggleExpansion && (
            <button
              type="button"
              onClick={onToggleExpansion}
              className="p-2 text-[var(--color-muted)] hover:text-[var(--color-darkest)] rounded-lg transition-colors"
              title={isExpanded ? "Collapse form" : "Expand form"}
            >
              {isExpanded ? <FiMinimize2 className="w-5 h-5" /> : <FiMaximize2 className="w-5 h-5" />}
            </button>
          )}
        </div>

        {addPropertyError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {addPropertyError}
          </div>
        )}

        <div className={`space-y-6 ${isExpanded ? 'max-w-none' : 'max-w-2xl'} transition-all duration-300`}>
          {/* Basic Information */}
          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Property title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Property description"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-4' : 'grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Property Type *</label>
              <select
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
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
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              >
                <option value="">Select Status</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="hold">On Hold</option>
              </select>
            </div>
          </div>

          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-2' : 'grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Furnishing</label>
              <select
                name="furnishing"
                value={form.furnishing}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              >
                <option value="">Select Furnishing</option>
                <option value="furnished">Furnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Area (sq ft) *</label>
              <input
                name="area_sqft"
                type="number"
                value={form.area_sqft}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Square feet"
              />
            </div>
          </div>

          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-3' : 'grid-cols-3'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Bedrooms *</label>
              <input
                name="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Bathrooms *</label>
              <input
                name="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={form.bathrooms}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Floors</label>
              <input
                name="floors"
                type="number"
                min="1"
                value={form.floors}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
          </div>

          {/* Array Fields */}
          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Utilities (comma separated)</label>
              <input
                name="utilities"
                value={utilities_temp}
                onChange={(e) => handleArrayChange('utilities', e.target.value)}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Water, Electricity, Gas, Internet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Amenities (comma separated)</label>
              <input
                name="amenities"
                value={amenities_temp}
                onChange={(e) => handleArrayChange('amenities', e.target.value)}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Gym, Pool, Parking, Laundry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Appliances Included (comma separated)</label>
              <input
                name="appliances_included"
                value={appliances_temp}
                onChange={(e) => handleArrayChange('appliances_included', e.target.value)}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Refrigerator, Stove, Washer, Dryer"
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-4' : 'grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Monthly Rent ($) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Monthly rent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Security Deposit ($)</label>
              <input
                name="deposit"
                type="number"
                step="0.01"
                value={form.deposit}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Security deposit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Lease Term (months)</label>
              <input
                name="lease_term"
                type="number"
                min="1"
                value={form.lease_term}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Application Fee ($)</label>
              <input
                name="application_fee"
                type="number"
                step="0.01"
                value={form.application_fee}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Application fee"
              />
            </div>
          </div>

          {/* Pet Policy */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Pet Policy</label>
            <select
              name="pet_policy"
              value={form.pet_policy}
              onChange={handleChange}
              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
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
          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-2' : 'grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Management Contact</label>
              <input
                name="property_management_contact"
                value={form.property_management_contact}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Contact information"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Website</label>
              <input
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Address *</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              placeholder="Street address"
            />
          </div>

          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-3' : 'grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">City *</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">State *</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Pincode *</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Pincode"
              />
            </div>
          </div>

          <div className={`grid gap-4 ${isExpanded ? 'lg:grid-cols-3' : 'grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Latitude</label>
              <input
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Latitude"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Longitude</label>
              <input
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
                placeholder="Longitude"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Available From</label>
              <input
                name="available_from"
                type="date"
                value={form.available_from}
                onChange={handleChange}
                className="w-full p-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              />
            </div>
          </div>

          {/* Media Files */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-darkest)] mb-1">Property Images</label>
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
            disabled={addPropertyLoading}
            className="flex-1 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <FiSave className="inline mr-2" />
            {addPropertyLoading ? 'Adding Property...' : 'Add Property'}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={addPropertyLoading}
            className="px-4 py-3 border border-[var(--color-tan)] rounded-lg hover:bg-[var(--color-light)] disabled:bg-gray-100 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;