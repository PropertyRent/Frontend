import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        {/* Title with icon */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded-md w-32"></div>
        </div>
        {/* Edit button */}
        <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Photo Section */}
        <div className="md:col-span-2 flex items-center gap-6">
          {/* Profile Photo */}
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          
          <div className="flex-1">
            {/* Name */}
            <div className="h-6 bg-gray-200 rounded-md w-40 mb-2"></div>
            {/* Role */}
            <div className="h-4 bg-gray-200 rounded-md w-20 mb-2"></div>
            {/* Verification Status */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded-md w-16"></div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-20"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-16"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-16"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-24"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 pt-6 border-t border-[var(--color-tan)]/20">
        <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-20"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;