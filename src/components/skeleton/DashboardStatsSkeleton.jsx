import React from 'react';

const DashboardStatsSkeleton = () => {
  const SkeletonStatCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Title */}
          <div className="h-4 bg-gray-200 rounded-md w-24 mb-3"></div>
          {/* Value */}
          <div className="h-8 bg-gray-200 rounded-md w-16"></div>
        </div>
        {/* Icon */}
        <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>
  );
};

export default DashboardStatsSkeleton;