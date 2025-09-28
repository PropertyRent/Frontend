import React, { useState, useEffect } from "react";
import PropertyCard from "../components/Properties/PropertyCard";
import PropertyFilters from "../components/Properties/PropertyFilters";

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "New York, NY",
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "apartment",
    image: "/Home1.jpg",
    description: "Beautiful modern apartment in the heart of downtown with stunning city views.",
    amenities: ["Gym", "Pool", "Parking", "Pet Friendly"],
    available: true
  },
  {
    id: 2,
    title: "Cozy Family House",
    location: "Los Angeles, CA",
    price: 3200,
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: "house",
    image: "/Home2.jpg",
    description: "Spacious family home with a beautiful garden and quiet neighborhood.",
    amenities: ["Garden", "Garage", "Fireplace"],
    available: true
  },
  {
    id: 3,
    title: "Luxury Penthouse",
    location: "Miami, FL",
    price: 4500,
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    type: "penthouse",
    image: "/Home3.jpg",
    description: "Stunning penthouse with ocean views and premium amenities.",
    amenities: ["Ocean View", "Balcony", "Concierge", "Pool"],
    available: true
  },
  {
    id: 4,
    title: "Studio Loft",
    location: "Chicago, IL",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    area: 800,
    type: "studio",
    image: "/Home1.jpg",
    description: "Trendy studio loft in an artistic neighborhood with high ceilings.",
    amenities: ["High Ceilings", "Exposed Brick", "Gym"],
    available: false
  },
  {
    id: 5,
    title: "Suburban Villa",
    location: "Austin, TX",
    price: 2800,
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    type: "house",
    image: "/Home2.jpg",
    description: "Spacious villa in a quiet suburban area with modern amenities.",
    amenities: ["Swimming Pool", "Garden", "Garage", "Security"],
    available: true
  },
  {
    id: 6,
    title: "City Center Condo",
    location: "Seattle, WA",
    price: 2200,
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    type: "condo",
    image: "/Home3.jpg",
    description: "Modern condo in the city center with easy access to public transport.",
    amenities: ["City View", "Gym", "Parking"],
    available: true
  }
];

export default function Properties() {
  const [properties, setProperties] = useState(mockProperties);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [sortBy, setSortBy] = useState("price-low");
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    bedrooms: "any",
    bathrooms: "any",
    propertyType: "any",
    available: "all"
  });

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...properties];

    // Apply filters
    filtered = filtered.filter(property => {
      const priceInRange = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
      const bedroomsMatch = filters.bedrooms === "any" || property.bedrooms === parseInt(filters.bedrooms);
      const bathroomsMatch = filters.bathrooms === "any" || property.bathrooms === parseInt(filters.bathrooms);
      const typeMatch = filters.propertyType === "any" || property.type === filters.propertyType;
      const availabilityMatch = filters.available === "all" || 
        (filters.available === "available" && property.available) ||
        (filters.available === "unavailable" && !property.available);

      return priceInRange && bedroomsMatch && bathroomsMatch && typeMatch && availabilityMatch;
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
          return a.area - b.area;
        case "area-high":
          return b.area - a.area;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-darkest)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-[var(--color-bg)] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover amazing properties that match your lifestyle and budget
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <PropertyFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </aside>

          {/* Properties Grid */}
          <main className="lg:w-3/4">
            {/* Results Summary */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredProperties.length} Properties Found
              </h2>
              
              {/* Mobile Sort Dropdown */}
              <div className="lg:hidden">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-[var(--color-light-brown)] rounded-lg bg-[var(--color-bg)] text-[var(--color-darkest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="bedrooms-low">Bedrooms: Low to High</option>
                  <option value="bedrooms-high">Bedrooms: High to Low</option>
                  <option value="area-low">Area: Small to Large</option>
                  <option value="area-high">Area: Large to Small</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-[var(--color-medium)] text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                <p className="text-[var(--color-medium)]">
                  Try adjusting your filters to see more properties
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </main>
  );
}