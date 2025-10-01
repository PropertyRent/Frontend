import React from 'react';

const PropertySkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      
      {/* Properties grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-[var(--color-tan)]/20 overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="h-48 bg-gray-200"></div>
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              
              {/* Status badge skeleton */}
              <div className="h-5 bg-gray-200 rounded w-20"></div>
              
              {/* Details skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              
              {/* Stats skeleton */}
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              
              {/* Price skeleton */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertySkeleton;