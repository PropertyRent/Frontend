import React from 'react';

const TeamSkeleton = ({ count = 4 }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center rounded-2xl p-6 bg-white shadow-sm animate-pulse"
          >
            {/* Profile Image Skeleton */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-300 mb-4 ring-4 ring-offset-2 ring-gray-100"></div>

            {/* Name Skeleton */}
            <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>

            {/* Role Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>

            {/* Bio Skeleton */}
            <div className="space-y-2 w-full">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSkeleton;