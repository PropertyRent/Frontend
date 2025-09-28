import React from "react";
import { Link } from "react-router-dom";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaRegHeart } from "react-icons/fa";

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    location,
    price,
    bedrooms,
    bathrooms,
    area,
    type,
    image,
    description,
    amenities,
    available
  } = property;

  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-[var(--color-light-brown)]/20">
      {/* Property Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Availability Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
          available 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {available ? 'Available' : 'Unavailable'}
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-3 right-12 px-2 py-1 bg-[var(--color-primary)] text-white rounded-full text-xs font-semibold capitalize">
          {type}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors duration-200"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-[var(--color-medium)]" />
          )}
        </button>
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-[var(--color-darkest)] line-clamp-1">
            {title}
          </h3>
          <span className="text-xl font-bold text-[var(--color-primary)]">
            ${price.toLocaleString()}/mo
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-[var(--color-medium)] mb-3">
          <FaMapMarkerAlt className="mr-1 text-sm" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Property Stats */}
        <div className="flex justify-between items-center mb-3 text-[var(--color-medium)]">
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
            <span className="text-sm">{area.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--color-dark)] mb-3 line-clamp-2">
          {description}
        </p>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[var(--color-light-brown)]/20 text-[var(--color-dark)] text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="px-2 py-1 bg-[var(--color-light-brown)]/20 text-[var(--color-dark)] text-xs rounded-full">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/properties/${id}`}
            className="flex-1 bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:bg-[var(--color-accent)] transition-colors duration-200 text-center text-sm font-semibold"
          >
            View Details
          </Link>
          <button
            className="flex-1 border-2 border-[var(--color-primary)] text-[var(--color-primary)] py-2 px-4 rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors duration-200 text-sm font-semibold"
            disabled={!available}
          >
            {available ? 'Contact' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}