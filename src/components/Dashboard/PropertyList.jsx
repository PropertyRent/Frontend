import { FiHome, FiEdit3, FiTrash2, FiMapPin, FiDollarSign } from "react-icons/fi";
import PropertyListSkeleton from "../skeleton/PropertyListSkeleton";

const PropertyList = ({ filtered, deleteProperty, onEditProperty }) => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-tan)]/20">
          <h3 className="text-lg font-semibold text-[var(--color-darkest)]">Properties ({filtered.length})</h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <PropertyListSkeleton count={5} />
          ) : (
            <div className="divide-y divide-[var(--color-tan)]/20">
              {filtered.map((property) => (
                <div key={property.id} className="p-6 hover:bg-[var(--color-bg)] transition-colors">
                  <div className="flex gap-4">
                    <img
                      src={property.media && property.media.length > 0 
                        ? property.media[0].url 
                        : property.images && property.images.length > 0
                        ? property.images[0]
                        : "/Home1.jpg"
                      }
                      alt={property.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-[var(--color-darkest)]">{property.title}</h4>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onEditProperty && onEditProperty(property)}
                            className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white rounded-lg transition-colors"
                            title="Edit property"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProperty(property.id)}
                            className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                            title="Delete property"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-[var(--color-muted)] mb-2">
                        <div className="flex items-center gap-1">
                          <FiMapPin className="w-4 h-4" />
                          {property.city && property.state ? `${property.city}, ${property.state}` : property.location || 'Location not specified'}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="w-4 h-4" />
                          ${property.price}/month
                        </div>
                        <div>{property.bedrooms || property.beds || 0} beds, {property.bathrooms || property.baths || 0} baths</div>
                        <div>{property.area_sqft || property.area || 0} sq ft</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'available' || property.status === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'rented' || property.status === 'Rented'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">
                          Added {property.created_at ? new Date(property.created_at).toLocaleDateString() : property.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;