import React from 'react';
import { FiMapPin, FiDollarSign, FiHome, FiArrowRight, FiEye } from 'react-icons/fi';

const PropertyBrowseResults = ({ properties, onPropertySelect, additionalOptions }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <FiHome className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No properties available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Property Grid */}
      <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
        {properties.map((property, index) => (
          <div
            key={property.id || index}
            className="border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer bg-white group"
            onClick={() => onPropertySelect(property.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight">
                    {property.title}
                  </h4>
                  <FiEye className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" />
                </div>
                
                <div className="flex items-center space-x-2 mb-2 text-xs text-gray-600">
                  <FiMapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm">
                    <FiDollarSign className="w-3 h-3 text-green-600" />
                    <span className="font-medium text-green-600">{property.price}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {property.type && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {property.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description if available */}
                {property.description && (
                  <div className="mt-2 text-xs text-gray-500 line-clamp-2">
                    {property.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Browse Actions */}
      <div className="flex items-center justify-between text-xs text-gray-500 bg-blue-50 p-2 rounded-lg">
        <span>👆 Click on any property to learn more</span>
        <FiArrowRight className="w-3 h-3" />
      </div>

      {/* Additional Options */}
      {additionalOptions && additionalOptions.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="space-y-2">
            {additionalOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onPropertySelect(option.value)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-700 text-sm">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    )}
                  </div>
                  <FiArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyBrowseResults;