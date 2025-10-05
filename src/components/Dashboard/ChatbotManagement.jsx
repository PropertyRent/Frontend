import React, { useState, useEffect } from 'react';
import { 
  FiMessageSquare, 
  FiUsers, 
  FiEye,
  FiSearch, 
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiClock,
  FiMail,
  FiPhone,
  FiCalendar,
  FiBarChart,
  FiTrendingUp,
  FiUserCheck,
  FiUserX,
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';
import { FaRobot, FaComments } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ChatbotService from '../../services/chatbotService';

const ChatbotManagement = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'stats'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeTab, setActiveTab] = useState('conversations'); // 'conversations', 'stats'

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    flowType: '',
    satisfaction: ''
  });

  // Statistics
  const [stats, setStats] = useState({
    total_conversations: 0,
    status_breakdown: {
      completed: 0,
      escalated: 0,
      active: 0,
      abandoned: 0
    },
    satisfaction: {
      satisfied: 0,
      unsatisfied: 0,
      satisfaction_rate: 0
    },
    recent_activity: {
      conversations_last_7_days: 0
    }
  });

  useEffect(() => {
    if (activeTab === 'conversations') {
      fetchConversations();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [searchTerm, activeTab, pagination.page, filters]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await ChatbotService.getConversations(
        pagination.page,
        pagination.limit,
        filters.status || null
      );

      if (response.success) {
        setConversations(response.data.conversations || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total_conversations || 0,
          totalPages: Math.ceil((response.data.total_conversations || 0) / pagination.limit)
        }));
      } else {
        toast.error(response.message || 'Failed to fetch conversations');
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to fetch chatbot conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await ChatbotService.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch chatbot statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleViewConversation = async (conversation) => {
    try {
      const response = await ChatbotService.getConversationDetails(conversation.id);
      if (response.success) {
        console.log('Fetched conversation details:', response);
        setSelectedConversation(response.data);
        setModalMode('view');
        setShowModal(true);
      } else {
        toast.error(response.message || 'Failed to fetch conversation details');
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      toast.error('Failed to fetch conversation details');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    if (activeTab === 'conversations') {
      fetchConversations();
    } else {
      fetchStats();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedConversation(null);
  };

  const StatCard = ({ title, count, color, icon: Icon, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'escalated': return '#F59E0B';
      case 'abandoned': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getFlowTypeLabel = (flowType) => {
    const flowTypes = {
      property_search: 'Property Search',
      rent_inquiry: 'Rent Inquiry',
      schedule_visit: 'Schedule Visit',
      general_support: 'General Support',
      bug_report: 'Bug Report',
      feedback: 'Feedback'
    };
    return flowTypes[flowType] || flowType;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.floor((end - start) / 1000 / 60); // minutes
    
    if (duration < 1) return '< 1 min';
    if (duration < 60) return `${duration} min`;
    return `${Math.floor(duration / 60)}h ${duration % 60}m`;
  };

  // Filter conversations based on search and filters
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = !searchTerm || 
      (conv.user_name && conv.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (conv.user_email && conv.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (conv.session_id && conv.session_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFlowType = !filters.flowType || conv.flow_type === filters.flowType;
    const matchesSatisfaction = !filters.satisfaction || 
      (filters.satisfaction === 'satisfied' && conv.is_satisfied === true) ||
      (filters.satisfaction === 'unsatisfied' && conv.is_satisfied === false) ||
      (filters.satisfaction === 'not_asked' && conv.is_satisfied === null);
    
    return matchesSearch && matchesFlowType && matchesSatisfaction;
  });

  if (loading && activeTab === 'conversations' && conversations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="w-full h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="w-full h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor chatbot conversations and analyze performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'conversations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiMessageSquare className="w-4 h-4 inline mr-2" />
              Conversations ({conversations.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiBarChart className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Conversations" 
              count={stats.total_conversations} 
              color="#3B82F6" 
              icon={FiMessageSquare}
            />
            <StatCard 
              title="Satisfaction Rate" 
              count={`${stats.satisfaction.satisfaction_rate}%`}
              color="#10B981" 
              icon={FiUserCheck}
              subtitle={`${stats.satisfaction.satisfied} satisfied`}
            />
            <StatCard 
              title="Recent Activity" 
              count={stats.recent_activity.conversations_last_7_days}
              color="#8B5CF6" 
              icon={FiTrendingUp}
              subtitle="Last 7 days"
            />
            <StatCard 
              title="Escalations" 
              count={stats.status_breakdown.escalated}
              color="#F59E0B" 
              icon={FiAlertTriangle}
              subtitle="Need attention"
            />
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaRobot className="w-5 h-5 mr-2 text-blue-600" />
                Conversation Status
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.status_breakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: getStatusColor(status) }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Satisfaction Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUserCheck className="w-5 h-5 mr-2 text-green-600" />
                User Satisfaction
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiUserCheck className="w-4 h-4 mr-3 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Satisfied</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{stats.satisfaction.satisfied}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiUserX className="w-4 h-4 mr-3 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">Unsatisfied</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{stats.satisfaction.unsatisfied}</span>
                </div>
                
                {/* Satisfaction Rate Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Satisfaction Rate</span>
                    <span>{stats.satisfaction.satisfaction_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${stats.satisfaction.satisfaction_rate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversations Tab */}
      {activeTab === 'conversations' && (
        <div className="space-y-6">
          {/* Quick Stats for Conversations */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <StatCard 
              title="Active Chats" 
              count={stats.status_breakdown.active} 
              color="#3B82F6" 
              icon={FiMessageSquare}
            />
            <StatCard 
              title="Completed" 
              count={stats.status_breakdown.completed} 
              color="#10B981" 
              icon={FiCheck}
            />
            <StatCard 
              title="Escalated" 
              count={stats.status_breakdown.escalated} 
              color="#F59E0B" 
              icon={FiAlertTriangle}
            />
            <StatCard 
              title="Abandoned" 
              count={stats.status_breakdown.abandoned} 
              color="#EF4444" 
              icon={FiX}
            />
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or session..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="escalated">Escalated</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>
              <div>
                <select
                  value={filters.flowType}
                  onChange={(e) => setFilters(prev => ({ ...prev, flowType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Flow Types</option>
                  <option value="property_search">Property Search</option>
                  <option value="rent_inquiry">Rent Inquiry</option>
                  <option value="schedule_visit">Schedule Visit</option>
                  <option value="general_support">General Support</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div>
                <select
                  value={filters.satisfaction}
                  onChange={(e) => setFilters(prev => ({ ...prev, satisfaction: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Satisfaction</option>
                  <option value="satisfied">Satisfied</option>
                  <option value="unsatisfied">Unsatisfied</option>
                  <option value="not_asked">Not Asked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conversations Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Conversations ({filteredConversations.length})
              </h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <FiLoader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <FaComments className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                <p className="text-gray-500">No chatbot conversations match your current filters.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User & Session
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Flow Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Messages
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Satisfaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredConversations.map((conversation) => (
                        <tr key={conversation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {conversation.user_name || conversation.guest_name || 'Anonymous User'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {conversation.user_email || conversation.guest_email || 'No email'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                ID: {conversation.session_id?.substring(0, 8)}...
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getFlowTypeLabel(conversation.flow_type) || 'General'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: getStatusColor(conversation.status) }}
                            >
                              {conversation.status?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiMessageSquare className="w-4 h-4 mr-1 text-gray-400" />
                              {conversation.messages_count || 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {conversation.is_satisfied === true && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiUserCheck className="w-3 h-3 mr-1" />
                                Satisfied
                              </span>
                            )}
                            {conversation.is_satisfied === false && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FiUserX className="w-3 h-3 mr-1" />
                                Unsatisfied
                              </span>
                            )}
                            {conversation.is_satisfied === null && (
                              <span className="text-xs text-gray-500">Not asked</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <FiClock className="w-4 h-4 mr-1" />
                              {formatDuration(conversation.created_at, conversation.completed_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewConversation(conversation)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="View Conversation"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page <= 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={pagination.page >= pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                          <span className="font-medium">{pagination.totalPages}</span> ({pagination.total} total)
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                            disabled={pagination.page <= 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <FiChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                            disabled={pagination.page >= pagination.totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <FiChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Conversation Details Modal */}
      {showModal && selectedConversation && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Conversation Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Conversation Header */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedConversation.user_name || selectedConversation.guest_name || 'Anonymous'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedConversation.user_email || selectedConversation.guest_email || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Session ID:</span>
                        <span className="ml-2 text-sm text-gray-900 font-mono">
                          {selectedConversation.session_id}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Details</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Flow Type:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {getFlowTypeLabel(selectedConversation.flow_type) || 'General'}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className="ml-2">
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: getStatusColor(selectedConversation.status) }}
                          >
                            {selectedConversation.status?.toUpperCase()}
                          </span>
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Messages:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {selectedConversation.messages?.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Duration:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {formatDuration(selectedConversation.created_at, selectedConversation.completed_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {selectedConversation.messages && selectedConversation.messages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Conversation Flow</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedConversation.messages.map((message, index) => (
                      <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-blue-600">
                            Step {message.step_number}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                        
                        {/* Bot Question */}
                        <div className="mb-3">
                          <div className="flex items-center mb-1">
                            <FaRobot className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Bot:</span>
                          </div>
                          <p className="text-sm text-gray-900 ml-6">
                            {message.question}
                          </p>
                        </div>
                        
                        {/* User Response */}
                        {message.answer && (
                          <div>
                            <div className="flex items-center mb-1">
                              <FiUsers className="w-4 h-4 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-gray-700">User:</span>
                              {message.response_time_seconds && (
                                <span className="ml-auto text-xs text-gray-500">
                                  Responded in {message.response_time_seconds}s
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-900 ml-6 bg-green-50 p-2 rounded">
                              {message.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Satisfaction & Escalation */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Satisfaction */}
                {selectedConversation.is_satisfied !== null && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">User Satisfaction</h4>
                    <div className="flex items-center">
                      {selectedConversation.is_satisfied ? (
                        <>
                          <FiUserCheck className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Satisfied</span>
                        </>
                      ) : (
                        <>
                          <FiUserX className="w-5 h-5 text-red-600 mr-2" />
                          <span className="text-red-800 font-medium">Unsatisfied</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Escalations */}
                {selectedConversation.escalations && selectedConversation.escalations.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Escalations</h4>
                    {selectedConversation.escalations.map((escalation, index) => (
                      <div key={escalation.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-orange-800">
                            {escalation.reason}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(escalation.created_at)}
                          </span>
                        </div>
                        {escalation.contact_email && (
                          <p className="text-gray-600">Contact: {escalation.contact_email}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotManagement;