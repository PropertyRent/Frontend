import React from 'react';

const PropertyListSkeleton = ({ count = 5 }) => {
  const SkeletonPropertyItem = () => (
    <div className="p-6 hover:bg-[var(--color-bg)] transition-colors animate-pulse">
      <div className="flex gap-4">
        {/* Property Image */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            {/* Property Title */}
            <div className="h-6 bg-gray-200 rounded-md w-48"></div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-2">
            {/* Location and Price */}
            <div className="h-4 bg-gray-200 rounded-md w-32"></div>
            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
            
            {/* Bed/Bath and Area */}
            <div className="h-4 bg-gray-200 rounded-md w-28"></div>
            <div className="h-4 bg-gray-200 rounded-md w-20"></div>
          </div>
          
          <div className="flex items-center justify-between">
            {/* Status Badge */}
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            
            {/* Date */}
            <div className="h-4 bg-gray-200 rounded-md w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-tan)]/20 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-tan)]/20">
          {/* Header */}
          <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          <div className="divide-y divide-[var(--color-tan)]/20">
            {Array.from({ length: count }, (_, index) => (
              <SkeletonPropertyItem key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListSkeleton;