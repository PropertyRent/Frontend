import React, { useContext, useEffect } from 'react';
import { FiHome, FiCheckCircle, FiUsers, FiTool, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import { PropertyContext } from '../../stores/propertyStore';
import DashboardStatsSkeleton from '../skeleton/DashboardStatsSkeleton';
import RecentPropertiesSkeleton from '../skeleton/RecentPropertiesSkeleton';

const DashboardOverview = () => {
  const {
    propertyStats,
    propertyStatsLoading,
    propertyStatsError,
    fetchPropertyStats,
    recentProperties,
    recentPropertiesLoading,
    recentPropertiesError,
    fetchRecentProperties,
  } = useContext(PropertyContext);

  useEffect(() => {
    fetchPropertyStats();
    fetchRecentProperties();
  }, []);

  const renderStatCard = (title, value, icon, color, isLoading) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--color-muted)]">{title}</p>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <FiRefreshCw className="w-4 h-4 animate-spin text-[var(--color-secondary)]" />
              <span className="text-sm text-[var(--color-muted)]">Loading...</span>
            </div>
          ) : (
            <p className={`text-3xl font-bold ${color}`}>
              {value || 0}
            </p>
          )}
        </div>
        {React.createElement(icon, { className: `text-3xl ${color.replace('text-', 'text-').split('-')[1] ? color : 'text-[var(--color-secondary)]'}` })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      {propertyStatsLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderStatCard(
            "Total Properties",
            propertyStats?.total_properties,
            FiHome,
            "text-[var(--color-darkest)]",
            propertyStatsLoading
          )}
          
          {renderStatCard(
            "Available",
            propertyStats?.available_properties,
            FiCheckCircle,
            "text-green-600",
            propertyStatsLoading
          )}
          
          {renderStatCard(
            "Rented",
            propertyStats?.rented_properties,
            FiUsers,
            "text-blue-600",
            propertyStatsLoading
          )}
          
          {renderStatCard(
            "Maintenance",
            propertyStats?.maintenance_properties,
            FiTool,
            "text-orange-600",
            propertyStatsLoading
          )}
        </div>
      )}

      

      {/* Error States */}
      {propertyStatsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading stats: {propertyStatsError}</p>
        </div>
      )}

      {recentPropertiesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading recent properties: {recentPropertiesError}</p>
        </div>
      )}

      {/* Recent Properties */}
      <div className="grid lg:grid-cols-1 gap-8">
        {recentPropertiesLoading ? (
          <RecentPropertiesSkeleton />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--color-tan)]/20">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-darkest)]">Recent Properties</h3>
            
            {recentProperties && recentProperties.length > 0 ? (
            <div className="space-y-3">
              {recentProperties.map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--color-light)] hover:bg-[var(--color-tan)]/10 transition-colors">
                  {property.cover_image ? (
                    <img
                      src={property.cover_image}
                      alt={property.title}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-[var(--color-tan)]/30"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[var(--color-tan)]/20 flex items-center justify-center">
                      <FiHome className="text-[var(--color-secondary)] text-xl" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--color-darkest)] mb-1">{property.title}</h4>
                    <p className="text-sm text-[var(--color-muted)] mb-1">${property.price}/month</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
                      <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                      <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                      <span>{property.property_type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      property.status.toLowerCase() === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : property.status.toLowerCase() === 'rented'
                        ? 'bg-blue-100 text-blue-800'
                        : property.status.toLowerCase() === 'maintenance'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status}
                    </span>
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      {new Date(property.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
              <div className="text-center py-8">
                <FiHome className="w-12 h-12 text-[var(--color-tan)] mx-auto mb-3" />
                <p className="text-[var(--color-muted)]">No recent properties found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;