import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaArrowLeft, FaHeart, FaRegHeart, FaPhone, FaEnvelope, FaHome, FaCalendarAlt, FaCar, FaPaw } from 'react-icons/fa';
import { FiLoader, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { PropertyContext } from '../stores/propertyStore';
import PropertyDetailSkeleton from '../components/skeleton/PropertyDetailSkeleton';


export default function PropertyDetail() {
  const { id } = useParams();
  const {
    currentProperty,
    fetchProperty,
    propertyLoading,
    propertyError,
    clearPropertyError
  } = useContext(PropertyContext);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  // Reset image index when property changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentProperty]);

  // Helper function to parse array fields
  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) {
      return field.map(item => {
        if (typeof item === 'string') {
          return item.replace(/^\[?"?|"?\]?$/g, '').replace(/"/g, '');
        }
        return item;
      });
    }
    return [];
  };

  // Process property data
  const processedProperty = currentProperty ? {
    ...currentProperty,
    // Parse utilities, amenities, and appliances if they're strings
    parsedUtilities: parseArrayField(currentProperty.utilities),
    parsedAmenities: parseArrayField(currentProperty.amenities), 
    parsedAppliances: parseArrayField(currentProperty.appliances_included),
    // Create location string
    fullAddress: `${currentProperty.address}, ${currentProperty.city}, ${currentProperty.state}`,
    // Get images from media array
    images: currentProperty.media?.map(m => m.url) || ['/Home1.jpg'],
    // Check availability
    available: currentProperty.status === 'available'
  } : null;

  

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleRefresh = () => {
    clearPropertyError();
    fetchProperty(id);
  };

  const nextImage = () => {
    if (processedProperty?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === processedProperty.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (processedProperty?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? processedProperty.images.length - 1 : prev - 1
      );
    }
  };

  if (propertyLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (!propertyLoading && !processedProperty && !propertyError) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <FaHome className="text-[var(--color-secondary)] w-full text-center text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-[var(--color-darkest)] mb-2">Property Not Found</h2>
          <p className="text-[var(--color-muted)] mb-6">The property you're looking for doesn't exist.</p>
          <Link
            to="/properties"
            className="bg-[var(--color-secondary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-darker)] transition-colors duration-200"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Error State
  if (propertyError && !propertyLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/properties"
            className="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-darker)] transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </Link>
        </div>
        <div className="container mx-auto px-4 flex items-center justify-center min-h-[50vh]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-800 mb-2">Failed to load property</h2>
              <p className="text-red-600 text-sm mb-4">{propertyError}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <Link
                  to="/properties"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Back to Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/properties"
          className="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-darker)] transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Back to Properties
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery and Property Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img
                  src={processedProperty.images[currentImageIndex] || '/Home1.jpg'}
                  alt={processedProperty.title}
                  className="w-full h-130 object-cover"
                  onError={(e) => {
                    e.target.src = '/Home1.jpg';
                  }}
                />
              </div>
              
              {/* Image Navigation */}
              {processedProperty.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                  >
                    →
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {processedProperty.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {processedProperty.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-darkest)] mb-2">
                    {processedProperty.title}
                  </h1>
                  <div className="flex items-center text-[var(--color-muted)] mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{processedProperty.fullAddress}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
                    <span className="capitalize">{processedProperty.property_type}</span>
                    <span className="capitalize">{processedProperty.furnishing}</span>
                    <span className={`font-semibold ${
                      processedProperty.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {processedProperty.available ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleFavoriteClick}
                  className="p-3 bg-[var(--color-bg)] rounded-full border hover:bg-gray-50 transition-colors duration-200"
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500 text-xl" />
                  ) : (
                    <FaRegHeart className="text-[var(--color-medium)] text-xl" />
                  )}
                </button>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[var(--color-light)] p-4 rounded-lg text-center">
                  <FaBed className="text-[var(--color-secondary)] text-2xl mx-auto mb-2" />
                  <div className="text-lg font-semibold text-[var(--color-darkest)]">{processedProperty.bedrooms}</div>
                  <div className="text-sm text-[var(--color-muted)]">Bedrooms</div>
                </div>
                <div className="bg-[var(--color-light)] p-4 rounded-lg text-center">
                  <FaBath className="text-[var(--color-secondary)] text-2xl mx-auto mb-2" />
                  <div className="text-lg font-semibold text-[var(--color-darkest)]">{processedProperty.bathrooms}</div>
                  <div className="text-sm text-[var(--color-muted)]">Bathrooms</div>
                </div>
                <div className="bg-[var(--color-light)] p-4 rounded-lg text-center">
                  <FaRulerCombined className="text-[var(--color-secondary)] text-2xl mx-auto mb-2" />
                  <div className="text-lg font-semibold text-[var(--color-darkest)]">
                    {processedProperty.area_sqft ? Math.round(processedProperty.area_sqft).toLocaleString() : 'N/A'}
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">Sq Ft</div>
                </div>
                <div className="bg-[var(--color-light)] p-4 rounded-lg text-center">
                  <FaHome className="text-[var(--color-secondary)] text-2xl mx-auto mb-2" />
                  <div className="text-lg font-semibold text-[var(--color-darkest)] capitalize">{processedProperty.property_type}</div>
                  <div className="text-sm text-[var(--color-muted)]">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Description</h3>
                <p className="text-[var(--color-dark)] leading-relaxed">{processedProperty.description}</p>
              </div>

              {/* Amenities & Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Amenities & Features</h3>
                
                {/* Utilities */}
                {processedProperty.parsedUtilities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-[var(--color-darkest)] mb-2">Utilities Included</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {processedProperty.parsedUtilities.map((utility, index) => (
                        <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                          <span className="text-blue-500 mr-2">⚡</span>
                          <span className="text-[var(--color-darkest)] text-sm capitalize">{utility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Amenities */}
                {processedProperty.parsedAmenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-[var(--color-darkest)] mb-2">Property Amenities</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {processedProperty.parsedAmenities.map((amenity, index) => (
                        <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-[var(--color-darkest)] text-sm capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Appliances */}
                {processedProperty.parsedAppliances.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-[var(--color-darkest)] mb-2">Appliances Included</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {processedProperty.parsedAppliances.map((appliance, index) => (
                        <div key={index} className="flex items-center p-2 bg-purple-50 rounded-lg">
                          <FaHome className="text-purple-500 mr-2" />
                          <span className="text-[var(--color-darkest)] text-sm capitalize">{appliance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Property Type:</strong> <span className="capitalize">{processedProperty.property_type}</span></div>
                  <div><strong>Furnishing:</strong> <span className="capitalize">{processedProperty.furnishing}</span></div>
                  <div><strong>Floors:</strong> {processedProperty.floors || 'N/A'}</div>
                  <div><strong>Deposit:</strong> ${processedProperty.deposit?.toLocaleString() || 'N/A'}</div>
                  <div><strong>Application Fee:</strong> ${processedProperty.application_fee?.toLocaleString() || 'N/A'}</div>
                  <div><strong>Available From:</strong> {processedProperty.available_from ? new Date(processedProperty.available_from).toLocaleDateString() : 'N/A'}</div>
                  {processedProperty.pet_policy && (
                    <div className="md:col-span-2"><strong>Pet Policy:</strong> {processedProperty.pet_policy}</div>
                  )}
                  {processedProperty.lease_term && (
                    <div className="md:col-span-2"><strong>Lease Terms:</strong> {processedProperty.lease_term}</div>
                  )}
                  {processedProperty.website && (
                    <div className="md:col-span-2">
                      <strong>Website:</strong> 
                      <a href={processedProperty.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-secondary)] hover:underline ml-1">
                        {processedProperty.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[var(--color-secondary)] mb-2">
                  ${processedProperty.price?.toLocaleString() || 'N/A'}/mo
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  processedProperty.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {processedProperty.available ? 'Available Now' : 'Not Available'}
                </div>
                {processedProperty.deposit && (
                  <div className="text-sm text-[var(--color-muted)] mt-2">
                    Security Deposit: ${processedProperty.deposit.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Property Management</h4>
                {processedProperty.property_management_contact ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-[var(--color-bg)] rounded-lg">
                      <div className="text-sm text-[var(--color-darkest)] whitespace-pre-line">
                        {processedProperty.property_management_contact}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        PM
                      </div>
                      <div>
                        <div className="font-medium text-[var(--color-darkest)]">Property Manager</div>
                        <div className="text-sm text-[var(--color-medium)]">Contact for details</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col space-y-3">
                {processedProperty.available ? (
                  <Link
                    to={`/schedule-meeting/${processedProperty.id}`}
                    className="w-full text-center bg-[var(--color-secondary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--color-darker)] transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
                  >
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>Schedule Viewing</span>
                  </Link>
                ) : (
                  <div className="w-full text-center bg-gray-400 text-white py-3 px-4 rounded-lg cursor-not-allowed font-semibold">
                    Not Available
                  </div>
                )}
                <Link 
                  to={`/apply/${processedProperty.id}`} 
                  className="w-full text-center border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] py-3 px-4 rounded-lg hover:bg-[var(--color-secondary)] hover:text-white transition-colors duration-200 font-semibold flex items-center justify-center space-x-2"
                >
                  <FaHome className="w-4 h-4" />
                  <span>Apply Now</span>
                </Link>
                <Link to="/contact" className="w-full text-center bg-[var(--color-tan)] text-[var(--color-darkest)] py-3 px-4 rounded-lg hover:bg-[var(--color-light-brown)] hover:text-white transition-colors duration-200 font-semibold">
                  Contact Property
                </Link>
                <Link
                  to="/properties"
                  className="w-full block text-center border border-gray-300 text-gray-600 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold"
                >
                  View More Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}