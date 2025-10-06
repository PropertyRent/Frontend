import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaBath,
  FaFilter,
  FaWindowClose,
  FaChevronDown,
  FaMapPin,
  FaHome,
  FaBed,
  FaDollarSign,
} from "react-icons/fa";

const CustomDropdown = ({
  label,
  value,
  options,
  onChange,
  placeholder,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-medium text-[var(--color-darkest)] mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-[var(--color-tan)]/50 rounded-lg hover:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[var(--color-muted)]" />}
          <span
            className={`text-sm ${
              selectedOption
                ? "text-[var(--color-darkest)]"
                : "text-[var(--color-muted)]"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <FaChevronDown
          className={`w-4 h-4 text-[var(--color-muted)] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[var(--color-tan)]/50 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 text-sm hover:bg-[var(--color-light)] transition-colors ${
                value === option.value
                  ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-medium"
                  : "text-[var(--color-darkest)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PriceRangeSlider = ({
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 100,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinInputChange = (e) => {
    // const newMin = Math.min(parseInt(e.target.value) || 0, localValue[1]);
    const newValue = [parseInt(e.target.value) || 0, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxInputChange = (e) => {
    // const newMax = Math.max(parseInt(e.target.value) || 0, localValue[0]);
    const newValue = [localValue[0], parseInt(e.target.value) || 0];
    setLocalValue(newValue);
    onChange(newValue);
  };

  //   console.log("PriceRangeSlider localValue:", localValue);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-[var(--color-darkest)] mb-1">
        Price Range ($/month)
      </label>

      <div className="px-3 py-2.5 bg-white border border-[var(--color-tan)]/50 rounded-lg">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[var(--color-muted)]">
                $
              </span>
              <input
                type="number"
                value={localValue[0]}
                onChange={handleMinInputChange}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 text-sm border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] transition-colors"
                min={min}
                max={localValue[1]}
                step={step}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-muted)] mb-1">
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-[var(--color-muted)]">
                $
              </span>
              <input
                type="number"
                value={localValue[1]}
                onChange={handleMaxInputChange}
                placeholder="10000"
                className="w-full pl-7 pr-3 py-2 text-sm border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] transition-colors"
                min={localValue[0]}
                max={max}
                step={step}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PropertySearchFilters({
  onApplyFilters,
  initialFilters = {},
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    keyword: "",
    propertyType: "any",
    bedrooms: "any",
    bathrooms: "any",
    priceRange: [0, 10000],
    furnishing: "any",
    city: "",
    status: "all",
    ...initialFilters,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const propertyTypeOptions = [
    { value: "any", label: "Any Type" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "studio", label: "Studio" },
    { value: "townhouse", label: "Townhouse" },
    { value: "villa", label: "Villa" },
    { value: "duplex", label: "Duplex" },
  ];

  const bedroomOptions = [
    { value: "any", label: "Any" },
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4+ Bedrooms" },
  ];

  const bathroomOptions = [
    { value: "any", label: "Any" },
    { value: "1", label: "1 Bathroom" },
    { value: "2", label: "2 Bathrooms" },
    { value: "3", label: "3+ Bathrooms" },
  ];

  const furnishingOptions = [
    { value: "any", label: "Any" },
    { value: "furnished", label: "Furnished" },
    { value: "semi-furnished", label: "Semi-Furnished" },
    { value: "unfurnished", label: "Unfurnished" },
  ];

  const statusOptions = [
    { value: "all", label: "All Properties" },
    { value: "available", label: "Available Only" },
    { value: "rented", label: "Rented Only" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Apply filters without updating URL parameters
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      keyword: "",
      propertyType: "any",
      bedrooms: "any",
      bathrooms: "any",
      priceRange: [0, 10000],
      furnishing: "any",
      city: "",
      status: "all",
    };
    setFilters(resetFilters);
    
    // Apply reset filters without updating URL parameters
    onApplyFilters(resetFilters);
  };

  const hasActiveFilters = () => {
    return (
      filters.keyword !== "" ||
      filters.propertyType !== "any" ||
      filters.bedrooms !== "any" ||
      filters.bathrooms !== "any" ||
      filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 10000 ||
      filters.furnishing !== "any" ||
      filters.city !== "" ||
      filters.status !== "all"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--color-tan)]/20 p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaFilter className="w-5 h-5 text-[var(--color-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--color-darkest)]">
            Search & Filter Properties
          </h3>
          {hasActiveFilters() && (
            <span className="px-2 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 text-[var(--color-muted)] hover:text-[var(--color-darkest)] rounded-lg transition-colors"
        >
          <FaChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
        <input
          type="text"
          placeholder="Search by title, location, or description..."
          value={filters.keyword}
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] transition-colors"
        />
        {filters.keyword && (
          <button
            onClick={() => handleFilterChange("keyword", "")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-[var(--color-muted)] hover:text-[var(--color-darkest)] transition-colors"
          >
            <FaWindowClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters - Expandable on Mobile */}
      <div className={`${isExpanded ? "block" : "hidden lg:block"}`}>
        <div className="space-y-4 mb-4">
          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <CustomDropdown
              label="Property Type"
              value={filters.propertyType}
              options={propertyTypeOptions}
              onChange={(value) => handleFilterChange("propertyType", value)}
              placeholder="Any Type"
              icon={FaHome}
            />

            <CustomDropdown
              label="Bedrooms"
              value={filters.bedrooms}
              options={bedroomOptions}
              onChange={(value) => handleFilterChange("bedrooms", value)}
              placeholder="Any"
              icon={FaBed}
            />

            <CustomDropdown
              label="Bathrooms"
              value={filters.bathrooms}
              options={bathroomOptions}
              onChange={(value) => handleFilterChange("bathrooms", value)}
              placeholder="Any"
              icon={FaBath}
            />

            <CustomDropdown
              label="Furnishing"
              value={filters.furnishing}
              options={furnishingOptions}
              onChange={(value) => handleFilterChange("furnishing", value)}
              placeholder="Any"
              icon={FaHome}
            />

            <div className="relative">
              <label className="block text-xs font-medium text-[var(--color-darkest)] mb-1">
                City
              </label>
              <div className="relative">
                <FaMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-[var(--color-tan)]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] transition-colors"
                />
              </div>
            </div>
            <CustomDropdown
              label="Availability Status"
              value={filters.status}
              options={statusOptions}
              onChange={(value) => handleFilterChange("status", value)}
              placeholder="All Properties"
              icon={FaDollarSign}
            />
          </div>
          
          {/* Price Range - Separate Row */}
          <div className="w-full">
            <PriceRangeSlider
              value={filters.priceRange}
              onChange={(value) => handleFilterChange("priceRange", value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaSearch className="w-4 h-4" />
            Apply Filters
          </button>

          {hasActiveFilters() && (
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 border border-[var(--color-tan)] text-[var(--color-darkest)] rounded-lg hover:bg-[var(--color-light)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaWindowClose className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
