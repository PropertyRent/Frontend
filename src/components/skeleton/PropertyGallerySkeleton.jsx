import React from 'react';

const PropertyGallerySkeleton = ({ count = 3 }) => {
  const SkeletonPropertyCard = ({ index }) => (
    <div 
      className="relative group cursor-pointer flex-shrink-0 h-100 overflow-hidden animate-pulse"
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Property Image Skeleton */}
      <div className="relative w-full h-full bg-gray-200 overflow-hidden">
        {/* Main image area with shimmer effect */}
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        
        {/* Property Info Overlay Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Property Title */}
          <div className="h-5 bg-white/30 rounded-md w-3/4 mb-2 backdrop-blur-sm"></div>
          
          {/* Location */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-white/30 rounded backdrop-blur-sm"></div>
            <div className="h-4 bg-white/30 rounded-md w-24 backdrop-blur-sm"></div>
          </div>
        </div>
        
        {/* Center hover icon skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
            <div className="w-6 h-6 bg-white/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full py-16 px-4 bg-[var(--color-bg)]">
      <div className="w-full mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-[var(--color-darkest)] mb-4">
            Featured Properties
          </h3>
          <p className="text-lg text-[var(--color-dark)] max-w-2xl mx-auto mb-6">
            Discover beautiful homes and apartments from our premium collection
          </p>
          
          {/* View All Button Skeleton */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 rounded-lg animate-pulse">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded-md w-32"></div>
          </div>
        </div>

        {/* Property Gallery Skeleton */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4">
            {Array.from({ length: count }, (_, index) => (
              <SkeletonPropertyCard key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyGallerySkeleton;