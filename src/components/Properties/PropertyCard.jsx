import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const {
    id,
    title,
    description,
    property_type: type,
    status,
    furnishing,
    area_sqft: area,
    bedrooms,
    bathrooms,
    utilities,
    amenities,
    appliances_included,
    price,
    address,
    city,
    state,
    media,
    available_from
  } = property;

  // Create location string
  const location = `${address}, ${city}, ${state}`;
  
  // Parse utilities, amenities, and appliances if they're strings
  const parseArrayField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) {
      // Handle the weird format from API where each item has extra quotes and brackets
      return field.map(item => {
        if (typeof item === 'string') {
          // Remove the extra brackets and quotes: "[\"electricity\"" -> "electricity"
          return item.replace(/^\[?"?|"?\]?$/g, '').replace(/"/g, '');
        }
        return item;
      });
    }
    return [];
  };

  const parsedUtilities = parseArrayField(utilities);
  const parsedAmenities = parseArrayField(amenities);
  const parsedAppliances = parseArrayField(appliances_included);
  
  // Combine all amenities for display
  const allAmenities = [...parsedUtilities, ...parsedAmenities, ...parsedAppliances];
  
  // Prepare images array for carousel
  const images = media && media.length > 0 ? media.map(item => item.url) : ['/Home1.jpg'];
  
  // Carousel navigation functions
  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  // Check if property is available
  const available = status === 'available';


  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-[var(--color-light-brown)]/20">
      {/* Property Image Carousel */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={images[currentImageIndex]}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Carousel Navigation - Show only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Availability Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold z-20 ${
          available 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {available ? 'Available' : 'Unavailable'}
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--color-secondary)] border border-white text-white rounded-full text-xs font-semibold z-20">
          {type}
        </div>
        
        {/* Image Counter - Show only if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs z-20">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-[var(--color-darkest)] line-clamp-1">
            {title}
          </h3>
          <span className="text-xl font-bold text-[var(--color-secondary)]">
            ${price.toLocaleString()}/mo
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-[var(--color-muted)] mb-3">
          <FaMapMarkerAlt className="mr-1 text-sm" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Property Stats */}
        <div className="flex justify-between items-center mb-3 text-[var(--color-muted)]">
          <div className="flex items-center">
            <FaBed className="mr-1" />
            <span className="text-sm">{bedrooms} bed{bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" />
            <span className="text-sm">{bathrooms} bath{bathrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-1" />
            <span className="text-sm">{area ? Math.round(area).toLocaleString() : 'N/A'} sqft</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--color-dark)] mb-3 line-clamp-2">
          {description}
        </p>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {allAmenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[var(--color-light-brown)]/20 text-[var(--color-dark)] text-xs rounded-full capitalize"
              >
                {amenity}
              </span>
            ))}
            {allAmenities.length > 3 && (
              <span className="px-2 py-1 bg-[var(--color-light-brown)]/20 text-[var(--color-dark)] text-xs rounded-full">
                +{allAmenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/properties/${id}`}
            className="flex-1 bg-[var(--color-secondary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-darker)] transition-colors duration-200 text-center text-sm font-semibold"
          >
            View Details
          </Link>
          <Link
            to={`/contact`}
            className="flex-1 text-center border-2 border-[var(--color-secondary)]/80 text-[var(--color-secondary)] py-2 px-4 rounded-lg hover:bg-[var(--color-secondary)]/80 hover:text-white transition-colors duration-200 text-sm font-semibold"
            disabled={!available}
          >
            {available ? 'Contact Us' : 'Unavailable'}
          </Link>
        </div>
      </div>
    </div>
  );
}