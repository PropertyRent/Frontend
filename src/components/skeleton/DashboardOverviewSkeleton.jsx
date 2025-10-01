import React from 'react';
import DashboardStatsSkeleton from './DashboardStatsSkeleton';
import RecentPropertiesSkeleton from './RecentPropertiesSkeleton';

const DashboardOverviewSkeleton = ({ showStats = true, showRecentProperties = true }) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      {showStats && <DashboardStatsSkeleton />}

      {/* Recent Properties Skeleton */}
      {showRecentProperties && (
        <div className="grid lg:grid-cols-1 gap-8">
          <RecentPropertiesSkeleton />
        </div>
      )}
    </div>
  );
};

export default DashboardOverviewSkeleton;