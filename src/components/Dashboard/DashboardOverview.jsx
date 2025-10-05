import React, { useContext, useEffect, useState } from 'react';
import { 
  FiHome, 
  FiCheckCircle, 
  FiUsers, 
  FiTool, 
  FiRefreshCw,
  FiPieChart,
  FiActivity,
  FiCalendar,
  FiBarChart2,
  FiMail,
  FiTrendingUp
} from "react-icons/fi";
import { PropertyContext } from '../../stores/propertyStore';
import DashboardStatsSkeleton from '../skeleton/DashboardStatsSkeleton';
import RecentPropertiesSkeleton from '../skeleton/RecentPropertiesSkeleton';
import ContactSection from './ContactSection';
import TeamSection from './TeamSection';

const DashboardOverview = ({ onNavigateToContacts, onNavigateToTeam }) => {
  const {
    propertyStats,
    propertyStatsLoading,
    propertyStatsError,
    fetchPropertyStats,
    recentProperties,
    recentPropertiesLoading,
    recentPropertiesError,
    fetchRecentProperties,
    contacts,
    contactsLoading,
    fetchContacts,
    teamMembers,
    teamMembersLoading,
    fetchTeamMembers,
  } = useContext(PropertyContext);

  const [contactStats, setContactStats] = useState({
    total: 0,
    unread: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const [teamStats, setTeamStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    recentJoins: 0
  });

  useEffect(() => {
    fetchPropertyStats();
    fetchRecentProperties();
    // Fetch contacts and team data if functions are available
    if (fetchContacts) fetchContacts();
    if (fetchTeamMembers) fetchTeamMembers();
  }, []);

  // Calculate contact statistics
  useEffect(() => {
    if (contacts) {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setContactStats({
        total: contacts.length || 0,
        unread: contacts.filter(contact => !contact.is_read).length || 0,
        thisWeek: contacts.filter(contact => {
          const contactDate = new Date(contact.created_at);
          return !isNaN(contactDate) && contactDate >= weekAgo;
        }).length || 0,
        thisMonth: contacts.filter(contact => {
          const contactDate = new Date(contact.created_at);
          return !isNaN(contactDate) && contactDate >= monthAgo;
        }).length || 0
      });
    } else {
      setContactStats({ total: 0, unread: 0, thisWeek: 0, thisMonth: 0 });
    }
  }, [contacts]);

  // Calculate team statistics
  useEffect(() => {
    if (teamMembers) {
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setTeamStats({
        total: teamMembers.length || 0,
        active: teamMembers.filter(member => member.is_active).length || 0,
        admins: teamMembers.filter(member => member.role === 'admin').length || 0,
        recentJoins: teamMembers.filter(member => {
          const memberDate = new Date(member.created_at);
          return !isNaN(memberDate) && memberDate >= monthAgo;
        }).length || 0
      });
    } else {
      setTeamStats({ total: 0, active: 0, admins: 0, recentJoins: 0 });
    }
  }, [teamMembers]);

  const renderStatCard = (title, value, icon, color, isLoading, subtitle) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
              {React.createElement(icon, { className: `w-6 h-6 ${color}` })}
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{title}</p>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <FiRefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
              )}
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Simple Bar Chart Component - Optimized alignment and spacing
  const SimpleBarChart = ({ data, maxHeight = 50 }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    if (data.length === 0) {
      return <div className="text-center text-gray-500 py-4">No data available</div>;
    }
    
    return (
      <div className="w-full px-1">
        <div className="flex items-end justify-center h-14 mb-3">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 max-w-16">
              <span className="text-xs font-semibold text-gray-700 mb-1">{item.value}</span>
              <div
                className={`w-5 ${item.color} rounded-t transition-all duration-500`}
                style={{ 
                  height: `${maxValue > 0 ? Math.max((item.value / maxValue) * maxHeight, 3) : 3}px`
                }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-500 text-center flex-1 max-w-16 truncate">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Simple Progress Ring Component
  const ProgressRing = ({ percentage, size = 60, strokeWidth = 6, color = "text-blue-500" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={color}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 min-h-screen bg-gray-50">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Monitor your property management system performance
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      {propertyStatsLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderStatCard(
            "Total Properties",
            propertyStats?.total_properties,
            FiHome,
            "text-blue-600",
            propertyStatsLoading,
            "All listings"
          )}
          
          {renderStatCard(
            "Available",
            propertyStats?.available_properties,
            FiCheckCircle,
            "text-green-600",
            propertyStatsLoading,
            "Ready to rent"
          )}
          
          {renderStatCard(
            "Rented",
            propertyStats?.rented_properties,
            FiUsers,
            "text-purple-600",
            propertyStatsLoading,
            "Occupied units"
          )}
          
          {renderStatCard(
            "Maintenance",
            propertyStats?.maintenance_properties,
            FiTool,
            "text-orange-600",
            propertyStatsLoading,
            "Under service"
          )}
        </div>
      )}

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Property Status Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Status</h3>
            <FiBarChart2 className="w-5 h-5 text-gray-400" />
          </div>
          
          {propertyStatsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <SimpleBarChart 
                data={[
                  { 
                    label: 'Available', 
                    value: propertyStats?.available_properties || 0, 
                    color: 'bg-green-500' 
                  },
                  { 
                    label: 'Rented', 
                    value: propertyStats?.rented_properties || 0, 
                    color: 'bg-blue-500' 
                  },
                  { 
                    label: 'Maintenance', 
                    value: propertyStats?.maintenance_properties || 0, 
                    color: 'bg-orange-500' 
                  }
                ]}
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">Total: {propertyStats?.total_properties || 0} properties</p>
              </div>
            </div>
          )}
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Occupancy Rate</h3>
            <FiPieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          {propertyStatsLoading ? (
            <div className="animate-pulse flex items-center justify-center h-24">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {propertyStats?.total_properties > 0 ? (
                <ProgressRing 
                  percentage={Math.round((propertyStats.rented_properties / propertyStats.total_properties) * 100)}
                  color="text-blue-500"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-sm">No properties yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Messages Analytics */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Analytics</h3>
            <FiMail className="w-5 h-5 text-gray-400" />
          </div>
          
          {contactsLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <SimpleBarChart 
                data={[
                  { 
                    label: 'Total', 
                    value: contactStats.total, 
                    color: 'bg-indigo-500' 
                  },
                  { 
                    label: 'Unread', 
                    value: contactStats.unread, 
                    color: 'bg-red-500' 
                  },
                  { 
                    label: 'This Week', 
                    value: contactStats.thisWeek, 
                    color: 'bg-green-500' 
                  },
                  { 
                    label: 'This Month', 
                    value: contactStats.thisMonth, 
                    color: 'bg-blue-500' 
                  }
                ]}
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {contactStats.total === 0 ? (
                    "No messages yet"
                  ) : contactStats.unread > 0 ? (
                    <span className="text-red-600 font-medium">
                      {contactStats.unread} need attention
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      All messages reviewed
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div> */}

        {/* Team Analytics */}
        {/* <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
            <FiUsers className="w-5 h-5 text-gray-400" />
          </div>
          
          {teamMembersLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <SimpleBarChart 
                data={[
                  { 
                    label: 'Total', 
                    value: teamStats.total, 
                    color: 'bg-cyan-500' 
                  },
                  { 
                    label: 'Active', 
                    value: teamStats.active, 
                    color: 'bg-green-500' 
                  },
                  { 
                    label: 'Admins', 
                    value: teamStats.admins, 
                    color: 'bg-purple-500' 
                  },
                  { 
                    label: 'New', 
                    value: teamStats.recentJoins, 
                    color: 'bg-orange-500' 
                  }
                ]}
              />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {teamStats.recentJoins > 0 ? 
                    `${teamStats.recentJoins} joined this month` : 
                    "No new members this month"
                  }
                </p>
              </div>
            </div>
          )}
        </div> */}



        {/* Performance Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <FiTrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {/* Occupancy Health */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Occupancy</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: propertyStats?.total_properties > 0 ? 
                        `${Math.round((propertyStats.rented_properties / propertyStats.total_properties) * 100)}%` : 
                        '0%' 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {propertyStats?.total_properties > 0 ? 
                    Math.round((propertyStats.rented_properties / propertyStats.total_properties) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Contact Response */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: contactStats.total > 0 ? 
                        `${Math.round(((contactStats.total - contactStats.unread) / contactStats.total) * 100)}%` : 
                        '100%' 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {contactStats.total > 0 ? 
                    Math.round(((contactStats.total - contactStats.unread) / contactStats.total) * 100) : 100}%
                </span>
              </div>
            </div>

            {/* Team Activity */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team Active</span>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ 
                      width: teamStats.total > 0 ? 
                        `${Math.round((teamStats.active / teamStats.total) * 100)}%` : 
                        '0%' 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {teamStats.total > 0 ? 
                    Math.round((teamStats.active / teamStats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Detailed Sections */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="lg:col-span-1">
          {recentPropertiesLoading ? (
            <RecentPropertiesSkeleton />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiHome className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Latest property additions</p>
              </div>
              
              <div className="p-4">
                {recentProperties && recentProperties.length > 0 ? (
                  <div className="space-y-3">
                    {recentProperties.slice(0, 5).map((property, index) => (
                      <div key={property.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative">
                          {property.cover_image ? (
                            <img
                              src={property.cover_image}
                              alt={property.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                              <FiHome className="text-gray-400 w-5 h-5" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate text-sm">
                            {property.title}
                          </h4>
                          <p className="text-sm text-gray-600">${property.price}/month</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{property.bedrooms}bed</span>
                            <span>•</span>
                            <span>{property.bathrooms}bath</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            property.status.toLowerCase() === 'available' 
                              ? 'bg-green-100 text-green-700'
                              : property.status.toLowerCase() === 'rented'
                              ? 'bg-blue-100 text-blue-700'
                              : property.status.toLowerCase() === 'maintenance'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FiHome className="w-6 h-6 text-gray-400" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">No Properties Yet</h4>
                    <p className="text-sm text-gray-500">Add your first property to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Messages Section */}
        <div className="lg:col-span-1">
          <ContactSection onNavigateToContacts={onNavigateToContacts} />
        </div>

        {/* Team Section */}
        <div className="lg:col-span-1">
          <TeamSection onNavigateToTeam={onNavigateToTeam} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;