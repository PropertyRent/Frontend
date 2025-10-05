import React, { useState, useEffect, useContext } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import PropertyCard from "../components/Properties/PropertyCard";
import PropertySearchFilters from "../components/Properties/PropertySearchFilters";
import { PropertyContext } from "../stores/propertyStore";
import { FiLoader, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import PropertiesSkeleton from "../components/skeleton/PropertiesSkeleton";
import { FaHome } from "react-icons/fa";

export default function Properties() {
  const {
    properties,
    fetchProperties,
    searchProperties,
    propertiesLoading,
    propertiesError,
    propertiesPagination,
    propertiesFilters,
    clearPropertiesError
  } = useContext(PropertyContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [hasProcessedURLParams, setHasProcessedURLParams] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    keyword: "",
    propertyType: "any",
    bedrooms: "any",
    bathrooms: "any",
    priceRange: [0, 10000],
    furnishing: "any",
    city: "",
    status: "all"
  });

  // Function to convert URL parameters to filter format
  const getFiltersFromURL = () => {
    const filters = {
      keyword: searchParams.get('keyword') || "",
      propertyType: searchParams.get('property_type') || "any",
      bedrooms: searchParams.get('bedrooms') || "any",
      bathrooms: searchParams.get('bathrooms') || "any",
      priceRange: [
        parseInt(searchParams.get('min_price')) || 0,
        parseInt(searchParams.get('max_price')) || 10000
      ],
      furnishing: searchParams.get('furnishing') || "any",
      city: searchParams.get('city') || "",
      status: searchParams.get('status') || "all"
    };



    return filters;
  };

  // Check if URL has search parameters
  const hasURLParams = () => {
    return searchParams.get('keyword') || 
           searchParams.get('property_type') || 
           searchParams.get('bedrooms') || 
           searchParams.get('bathrooms') || 
           searchParams.get('min_price') || 
           searchParams.get('max_price') || 
           searchParams.get('furnishing') || 
           searchParams.get('city') || 
           searchParams.get('status');
  };

  // Initialize - fetch properties when component mounts and handle URL parameters
  useEffect(() => {
    // Only process URL parameters once on initial mount
    if (hasProcessedURLParams) return;
    
    let isMounted = true;
    const urlFilters = getFiltersFromURL();
    setActiveFilters(urlFilters);

    // If there are URL parameters, perform search with those filters
    if (hasURLParams()) {
      setIsSearchActive(true);
      searchProperties(urlFilters);
      
      // Clear URL parameters after extracting them
      navigate('/properties', { replace: true });
    } else {
      // Otherwise fetch all properties
      fetchProperties();
    }

    // Mark that we've processed the initial URL parameters
    setHasProcessedURLParams(true);

    return () => {
      // Cleanup function if needed
      isMounted = false;
    };
  }, [hasProcessedURLParams]);

  const handleApplyFilters = async (filters) => {
    setActiveFilters(filters);
    setIsSearchActive(true);
    
    // Check if any filters are active
    const hasActiveFilters = filters.keyword !== "" ||
                           filters.propertyType !== "any" ||
                           filters.bedrooms !== "any" ||
                           filters.bathrooms !== "any" ||
                           filters.priceRange[0] !== 0 ||
                           filters.priceRange[1] !== 10000 ||
                           filters.furnishing !== "any" ||
                           filters.city !== "" ||
                           filters.status !== "all";

    if (hasActiveFilters) {
      // Use search API with filters
      searchProperties(filters);
    } else {
      // Reset to show all properties
      setIsSearchActive(false);
      fetchProperties();
    }
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
        {/* Search and Filter Section */}
        <PropertySearchFilters
          onApplyFilters={handleApplyFilters}
          initialFilters={activeFilters}
        />

        {/* Properties Grid */}
        <main>
          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {!propertiesLoading && `${properties.length} Properties Found`}
                {isSearchActive && (
                  <span className="ml-2 px-2 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-sm font-medium rounded-full">
                    Search Results
                  </span>
                )}
              </h2>
              {propertiesPagination && (
                <span className="text-sm text-[var(--color-medium)]">
                  Page {propertiesPagination.current_page} of {propertiesPagination.total_pages}
                </span>
              )}
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 text-[var(--color-secondary)] hover:text-[var(--color-darker)] transition-colors disabled:opacity-50"
              title="Refresh properties"
              disabled={propertiesLoading}
            >
              <FiRefreshCw className={`w-5 h-5 ${propertiesLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

            {/* Loading State */}
            {propertiesLoading && (
              <PropertiesSkeleton />
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
          {!propertiesLoading && !propertiesError && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {/* No Properties State */}
          {!propertiesLoading && !propertiesError && properties.length === 0 && isSearchActive && (
            <div className="text-center py-12">
              <div className="text-[var(--color-medium)] text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No Properties Match Your Search</h3>
              <p className="text-[var(--color-medium)] mb-4">
                Try adjusting your filters or search terms to see more properties
              </p>
              <button
                onClick={() => handleApplyFilters({
                  keyword: "",
                  propertyType: "any",
                  bedrooms: "any",
                  bathrooms: "any",
                  priceRange: [0, 10000],
                  furnishing: "any",
                  city: "",
                  status: "all"
                })}
                className="px-6 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:bg-[var(--color-darker)] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Empty State */}
          {!propertiesLoading && !propertiesError && properties.length === 0 && !isSearchActive && (
            <div className="text-center py-12">
              <FaHome className="text-[var(--color-medium)] text-6xl mb-4" />
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
    </main>
  );
}