import { FiHome, FiEdit3, FiTrash2, FiMapPin, FiDollarSign } from "react-icons/fi";

const PropertyList = ({ filtered, deleteProperty }) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-tan)]/20">
          <h3 className="text-lg font-semibold text-[var(--color-darkest)]">Properties ({filtered.length})</h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-muted)]">
              <FiHome className="mx-auto text-4xl mb-4 opacity-50" />
              <p>No properties found. Add some properties to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-tan)]/20">
              {filtered.map((property) => (
                <div key={property.id} className="p-6 hover:bg-[var(--color-bg)] transition-colors">
                  <div className="flex gap-4">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-[var(--color-darkest)]">{property.title}</h4>
                        <div className="flex gap-2">
                          <button className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:text-white rounded-lg transition-colors">
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteProperty(property.id)}
                            className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-[var(--color-muted)] mb-2">
                        <div className="flex items-center gap-1">
                          <FiMapPin className="w-4 h-4" />
                          {property.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="w-4 h-4" />
                          ${property.price}/month
                        </div>
                        <div>{property.beds} beds, {property.baths} baths</div>
                        <div>{property.area} sq ft</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'Available' 
                            ? 'bg-green-100 text-green-800'
                            : property.status === 'Rented'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                        <span className="text-xs text-[var(--color-muted)]">Added {property.createdAt}</span>
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