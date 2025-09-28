import React from "react";
import { FaFilter, FaSort } from "react-icons/fa";

export default function PropertyFilters({ filters, onFilterChange, sortBy, onSortChange }) {
  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    onFilterChange({
      ...filters,
      priceRange: newPriceRange
    });
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFilterChange({
      priceRange: [0, 5000],
      bedrooms: "any",
      bathrooms: "any", 
      propertyType: "any",
      available: "all"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-darkest)] flex items-center">
          <FaFilter className="mr-2" />
          Filters
        </h3>
        <button
          onClick={resetFilters}
          className="text-sm text-[var(--color-secondary)] hover:text-[var(--color-darker)] font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-darkest)] mb-3">
          Price Range ($/month)
        </label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-muted)] w-8">Min:</span>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(e, 0)}
              className="flex-1 accent-[var(--color-secondary)]"
            />
            <span className="text-sm font-medium text-[var(--color-darkest)] w-16">
              ${filters.priceRange[0]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--color-muted)] w-8">Max:</span>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(e, 1)}
              className="flex-1 accent-[var(--color-secondary)]"
            />
            <span className="text-sm font-medium text-[var(--color-darkest)] w-16">
              ${filters.priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-darkest)] mb-2">
          Bedrooms
        </label>
        <select
          value={filters.bedrooms}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-light-brown)] rounded-lg bg-[var(--color-bg)] text-[var(--color-darkest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="any">Any</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-darkest)] mb-2">
          Bathrooms
        </label>
        <select
          value={filters.bathrooms}
          onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-light-brown)] rounded-lg bg-[var(--color-bg)] text-[var(--color-darkest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="any">Any</option>
          <option value="1">1 Bathroom</option>
          <option value="2">2 Bathrooms</option>
          <option value="3">3+ Bathrooms</option>
        </select>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-darkest)] mb-2">
          Property Type
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-light-brown)] rounded-lg bg-[var(--color-bg)] text-[var(--color-darkest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="any">Any Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="condo">Condo</option>
          <option value="studio">Studio</option>
          <option value="penthouse">Penthouse</option>
        </select>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--color-darkest)] mb-2">
          Availability
        </label>
        <select
          value={filters.available}
          onChange={(e) => handleFilterChange('available', e.target.value)}
          className="w-full px-3 py-2 border border-[var(--color-light-brown)] rounded-lg bg-[var(--color-bg)] text-[var(--color-darkest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="all">All Properties</option>
          <option value="available">Available Only</option>
          <option value="unavailable">Unavailable Only</option>
        </select>
      </div>

      {/* Sort Options (Desktop only) */}
      <div className="hidden lg:block">
        <h4 className="text-lg font-semibold text-[var(--color-darkest)] flex items-center mb-3">
          <FaSort className="mr-2" />
          Sort By
        </h4>
        <div className="space-y-2">
          {[
            { value: "price-low", label: "Price: Low to High" },
            { value: "price-high", label: "Price: High to Low" },
            { value: "bedrooms-low", label: "Bedrooms: Low to High" },
            { value: "bedrooms-high", label: "Bedrooms: High to Low" },
            { value: "area-low", label: "Area: Small to Large" },
            { value: "area-high", label: "Area: Large to Small" }
          ].map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => onSortChange(e.target.value)}
                className="mr-2 accent-[var(--color-primary)]"
              />
              <span className="text-sm text-[var(--color-darkest)]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}