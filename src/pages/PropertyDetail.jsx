import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaArrowLeft, FaHeart, FaRegHeart, FaPhone, FaEnvelope } from 'react-icons/fa';

// Mock data - in real app this would come from API
const mockPropertyDetails = {
  1: {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "New York, NY",
    fullAddress: "123 Main Street, New York, NY 10001",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "apartment",
    images: ["/Home1.jpg", "/Home2.jpg", "/Home3.jpg"],
    description: "Beautiful modern apartment in the heart of downtown with stunning city views. This spacious 2-bedroom, 2-bathroom unit features floor-to-ceiling windows, hardwood floors, and premium finishes throughout. The open-concept living area flows seamlessly into a gourmet kitchen with stainless steel appliances and granite countertops.",
    amenities: ["Gym", "Pool", "Parking", "Pet Friendly", "Concierge", "Rooftop Deck", "In-unit Laundry", "Air Conditioning"],
    available: true,
    yearBuilt: 2018,
    parkingSpaces: 1,
    petPolicy: "Cats and dogs allowed (with deposit)",
    leaseTerms: "12 months minimum",
    utilities: "Heat and hot water included",
    contactInfo: {
      name: "John Smith",
      phone: "+1 (555) 123-4567",
      email: "john.smith@propertyrent.com"
    }
  }
  // Add more mock data as needed
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const propertyData = mockPropertyDetails[id];
      setProperty(propertyData);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-medium)]">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[var(--color-medium)] text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-[var(--color-darkest)] mb-2">Property Not Found</h2>
          <p className="text-[var(--color-medium)] mb-6">The property you're looking for doesn't exist.</p>
          <Link
            to="/properties"
            className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-accent)] transition-colors duration-200"
          >
            Back to Properties
          </Link>
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
          className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors duration-200"
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
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {/* Image Navigation */}
              {property.images.length > 1 && (
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
              {property.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
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
                    {property.title}
                  </h1>
                  <div className="flex items-center text-[var(--color-medium)] mb-2">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{property.fullAddress}</span>
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
                <div className="bg-[var(--color-bg)] p-4 rounded-lg text-center">
                  <FaBed className="text-[var(--color-primary)] text-2xl mx-auto mb-2" />
                  <div className="text-lg font-semibold text-[var(--color-darkest)]">{property.bedrooms}</div>
                  <div className="text-sm text-[var(--color-medium)]">Bedrooms</div>
                </div>
                <div className="bg-[var(--color-bg)] p-4 rounded-lg text-center">
                  <FaBath className="text-[var(--color-primary)] text-2xl mx-auto mb-2" />
                  <div className="text-lg font-semibold text-[var(--color-darkest)]">{property.bathrooms}</div>
                  <div className="text-sm text-[var(--color-medium)]">Bathrooms</div>
                </div>
                <div className="bg-[var(--color-bg)] p-4 rounded-lg text-center">
                  <FaRulerCombined className="text-[var(--color-primary)] text-2xl mx-auto mb-2" />
                  <div className="text-lg font-semibold text-[var(--color-darkest)]">{property.area.toLocaleString()}</div>
                  <div className="text-sm text-[var(--color-medium)]">Sq Ft</div>
                </div>
                <div className="bg-[var(--color-bg)] p-4 rounded-lg text-center">
                  <div className="text-[var(--color-primary)] text-2xl mx-auto mb-2">🏠</div>
                  <div className="text-lg font-semibold text-[var(--color-darkest)] capitalize">{property.type}</div>
                  <div className="text-sm text-[var(--color-medium)]">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Description</h3>
                <p className="text-[var(--color-dark)] leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-2 bg-[var(--color-bg)] rounded-lg">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-[var(--color-darkest)] text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Year Built:</strong> {property.yearBuilt}</div>
                  <div><strong>Parking:</strong> {property.parkingSpaces} space(s)</div>
                  <div><strong>Pet Policy:</strong> {property.petPolicy}</div>
                  <div><strong>Lease Terms:</strong> {property.leaseTerms}</div>
                  <div className="md:col-span-2"><strong>Utilities:</strong> {property.utilities}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                  ${property.price.toLocaleString()}/mo
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  property.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.available ? 'Available Now' : 'Not Available'}
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[var(--color-darkest)] mb-3">Contact Agent</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {property.contactInfo.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-darkest)]">{property.contactInfo.name}</div>
                      <div className="text-sm text-[var(--color-medium)]">Property Agent</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-[var(--color-darkest)]">
                    <FaPhone className="mr-3 text-[var(--color-primary)]" />
                    <span>{property.contactInfo.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-[var(--color-darkest)]">
                    <FaEnvelope className="mr-3 text-[var(--color-primary)]" />
                    <span className="break-all">{property.contactInfo.email}</span>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full bg-[var(--color-primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--color-accent)] transition-colors duration-200 font-semibold"
                  disabled={!property.available}
                >
                  {property.available ? 'Schedule Viewing' : 'Unavailable'}
                </button>
                <button className="w-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-3 px-4 rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200 font-semibold">
                  Send Message
                </button>
                <button className="w-full bg-[var(--color-light-brown)] text-[var(--color-darkest)] py-3 px-4 rounded-lg hover:bg-[var(--color-medium)] hover:text-white transition-colors duration-200 font-semibold">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}