import React from 'react';

const RecentPropertiesSkeleton = () => {
  const SkeletonPropertyItem = () => (
    <div className="flex items-center gap-4 p-3 rounded-lg animate-pulse">
      {/* Property Image */}
      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
      
      <div className="flex-1">
        {/* Property Title */}
        <div className="h-5 bg-gray-200 rounded-md w-48 mb-2"></div>
        
        {/* Price */}
        <div className="h-4 bg-gray-200 rounded-md w-24 mb-2"></div>
        
        {/* Property Details */}
        <div className="flex items-center gap-4">
          <div className="h-3 bg-gray-200 rounded-md w-12"></div>
          <div className="h-3 bg-gray-200 rounded-md w-12"></div>
          <div className="h-3 bg-gray-200 rounded-md w-16"></div>
        </div>
      </div>
      
      <div className="text-right">
        {/* Status Badge */}
        <div className="h-6 bg-gray-200 rounded-full w-20 mb-1"></div>
        {/* Date */}
        <div className="h-3 bg-gray-200 rounded-md w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded-md w-40 animate-pulse"></div>
      </div>
      
      <div className="space-y-3">
        <SkeletonPropertyItem />
        <SkeletonPropertyItem />
        <SkeletonPropertyItem />
        <SkeletonPropertyItem />
        <SkeletonPropertyItem />
      </div>
    </div>
  );
};

export default RecentPropertiesSkeleton;