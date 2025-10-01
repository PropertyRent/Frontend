import React from 'react';
import { FiMapPin, FiDollarSign, FiHome, FiArrowRight } from 'react-icons/fi';

const PropertySearchResults = ({ properties, onPropertySelect, searchKeyword, additionalOptions }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <FiHome className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No properties found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Property Cards */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {properties.map((property, index) => (
          <div
            key={property.id || index}
            className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer bg-white"
            onClick={() => onPropertySelect(property.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {property.title}
                </h4>
                
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                  <FiMapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1 text-sm">
                    <FiDollarSign className="w-3 h-3 text-green-600" />
                    <span className="font-medium text-green-600">{property.price}</span>
                  </div>
                  
                  {property.type && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {property.type}
                    </span>
                  )}
                </div>
                
                {property.bedrooms !== undefined && (
                  <div className="mt-1 text-xs text-gray-500">
                    {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} BHK`}
                  </div>
                )}
              </div>
              
              <FiArrowRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Additional Options */}
      {additionalOptions && additionalOptions.length > 0 && (
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="space-y-2">
            {additionalOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onPropertySelect(option.value)}
                className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <div className="font-medium text-gray-700">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Info */}
      {searchKeyword && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          Search results for: <span className="font-medium">"{searchKeyword}"</span>
        </div>
      )}
    </div>
  );
};

export default PropertySearchResults;