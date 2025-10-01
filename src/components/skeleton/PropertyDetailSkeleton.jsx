import React from 'react';

const PropertyDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Back Button Skeleton */}
      <div className="container mx-auto px-4 py-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Image Gallery and Property Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery Skeleton */}
            <div className="relative mb-6">
              <div className="w-full h-[520px] bg-gray-200 rounded-lg animate-pulse"></div>
              
              {/* Image Indicators Skeleton */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Property Details Card Skeleton */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  {/* Title */}
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                  
                  {/* Address */}
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  
                  {/* Property Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Favorite Button */}
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              {/* Property Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-[var(--color-light)] p-4 rounded-lg">
                    <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Description Section */}
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>

              {/* Amenities & Features Section */}
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
                
                {/* Utilities */}
                <div className="mb-4">
                  <div className="h-5 bg-gray-200 rounded w-36 mb-2 animate-pulse"></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="mb-4">
                  <div className="h-5 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Appliances */}
                <div>
                  <div className="h-5 bg-gray-200 rounded w-44 mb-2 animate-pulse"></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="flex items-center p-2 bg-purple-50 rounded-lg">
                        <div className="w-4 h-4 bg-gray-200 rounded mr-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div>
                <div className="h-6 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="flex">
                      <div className="h-4 bg-gray-200 rounded w-24 mr-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              {/* Price Section */}
              <div className="text-center mb-6">
                <div className="h-10 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-24 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mx-auto animate-pulse"></div>
              </div>

              {/* Property Management Section */}
              <div className="mb-6">
                <div className="h-6 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex flex-col space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailSkeleton;