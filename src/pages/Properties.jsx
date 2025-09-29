import React, { useState, useEffect, useContext } from "react";
import PropertyCard from "../components/Properties/PropertyCard";
import PropertyFilters from "../components/Properties/PropertyFilters";
import { PropertyContext } from "../stores/propertyStore";
import { FiLoader, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function Properties() {
  const {
    properties,
    fetchProperties,
    propertiesLoading,
    propertiesError,
    propertiesPagination,
    propertiesFilters,
    clearPropertiesError
  } = useContext(PropertyContext);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortBy, setSortBy] = useState("price-low");
  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, 10000],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any",
    available: "all",
    furnishing: "any",
    search: ""
  });

  // Initialize - fetch properties when component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  // Apply local filters and sorting
  useEffect(() => {
    if (!properties || properties.length === 0) {
      setFilteredProperties([]);
      return;
    }

    let filtered = [...properties];

    // Apply local filters
    filtered = filtered.filter(property => {
      const priceInRange = property.price >= localFilters.priceRange[0] && property.price <= localFilters.priceRange[1];
      const bedroomsMatch = localFilters.bedrooms === "any" || property.bedrooms === parseInt(localFilters.bedrooms);
      const bathroomsMatch = localFilters.bathrooms === "any" || property.bathrooms === parseInt(localFilters.bathrooms);
      const typeMatch = localFilters.propertyType === "any" || property.property_type === localFilters.propertyType;
      const furnishingMatch = localFilters.furnishing === "any" || property.furnishing === localFilters.furnishing;
      const availabilityMatch = localFilters.available === "all" || 
        (localFilters.available === "available" && property.status === "available") ||
        (localFilters.available === "unavailable" && property.status !== "available");
      
      // Search filter
      const searchMatch = !localFilters.search || 
        property.title.toLowerCase().includes(localFilters.search.toLowerCase()) ||
        property.description.toLowerCase().includes(localFilters.search.toLowerCase()) ||
        property.city.toLowerCase().includes(localFilters.search.toLowerCase()) ||
        property.state.toLowerCase().includes(localFilters.search.toLowerCase());

      return priceInRange && bedroomsMatch && bathroomsMatch && typeMatch && furnishingMatch && availabilityMatch && searchMatch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "bedrooms-low":
          return a.bedrooms - b.bedrooms;
        case "bedrooms-high":
          return b.bedrooms - a.bedrooms;
        case "area-low":
          return (a.area_sqft || 0) - (b.area_sqft || 0);
        case "area-high":
          return (b.area_sqft || 0) - (a.area_sqft || 0);
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, localFilters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleRefresh = () => {
    clearPropertiesError();
    fetchProperties();
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-darkest)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[var(--color-darker)] to-[var(--color-secondary)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Discover amazing properties that match your lifestyle and budget
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <PropertyFilters
              filters={localFilters}
              onFilterChange={handleFilterChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </aside>

          {/* Properties Grid */}
          <main className="lg:w-3/4">
            {/* Results Summary */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {propertiesLoading ? 'Loading...' : `${filteredProperties.length} Properties Found`}
                </h2>
                {propertiesPagination && (
                  <span className="text-sm text-[var(--color-medium)]">
                    Page {propertiesPagination.current_page} of {propertiesPagination.total_pages}
                  </span>
                )}
              </div>
              
              {/* Mobile Sort Dropdown */}
              <div className="lg:hidden flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-[var(--color-light-brown)] rounded-lg bg-[var(--color-bg)] text-[var(--color-darkest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  disabled={propertiesLoading}
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="bedrooms-low">Bedrooms: Low to High</option>
                  <option value="bedrooms-high">Bedrooms: High to Low</option>
                  <option value="area-low">Area: Small to Large</option>
                  <option value="area-high">Area: Large to Small</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <button
                  onClick={handleRefresh}
                  className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-darker)] transition-colors disabled:opacity-50"
                  title="Refresh properties"
                  disabled={propertiesLoading}
                >
                  <FiRefreshCw className={`w-5 h-5 ${propertiesLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {propertiesLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FiLoader className="w-8 h-8 animate-spin text-[var(--color-secondary)] mx-auto mb-4" />
                  <p className="text-[var(--color-medium)]">Loading properties...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {propertiesError && !propertiesLoading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-red-800 font-semibold mb-1">Failed to load properties</h3>
                    <p className="text-red-600 text-sm">{propertiesError}</p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {!propertiesLoading && !propertiesError && filteredProperties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* No Properties State */}
            {!propertiesLoading && !propertiesError && filteredProperties.length === 0 && properties.length > 0 && (
              <div className="text-center py-12">
                <div className="text-[var(--color-medium)] text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No Properties Match Your Filters</h3>
                <p className="text-[var(--color-medium)] mb-4">
                  Try adjusting your filters to see more properties
                </p>
                <button
                  onClick={() => setLocalFilters({
                    priceRange: [0, 10000],
                    bedrooms: "any",
                    bathrooms: "any",
                    propertyType: "any",
                    available: "all",
                    furnishing: "any",
                    search: ""
                  })}
                  className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:bg-[var(--color-darker)] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Empty State */}
            {!propertiesLoading && !propertiesError && properties.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[var(--color-medium)] text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">No Properties Available</h3>
                <p className="text-[var(--color-medium)] mb-4">
                  There are currently no properties listed. Please check back later.
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:bg-[var(--color-darker)] transition-colors"
                >
                  Refresh
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </main>
  );
}