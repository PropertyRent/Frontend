import React, { useState, useEffect } from 'react';
import { 
  FiMessageSquare, 
  FiUsers, 
  FiTrendingUp, 
  FiThumbsUp, 
  FiThumbsDown,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiEye,
  FiCalendar
} from 'react-icons/fi';
import { BiChart } from 'react-icons/bi';
import toast from 'react-hot-toast';
import ChatbotService from '../../services/chatbotService';

const ChatbotDashboard = () => {
  // Stats state
  const [stats, setStats] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination & filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [currentPage, statusFilter]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load stats and conversations in parallel
      const [statsResponse, conversationsResponse] = await Promise.all([
        ChatbotService.getStats(),
        ChatbotService.getConversations(currentPage, 20, statusFilter)
      ]);
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      
      if (conversationsResponse.success) {
        setConversations(conversationsResponse.data.conversations);
        setTotalPages(conversationsResponse.data.pagination.pages);
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  const viewConversationDetails = async (conversationId) => {
    try {
      const response = await ChatbotService.getConversationDetails(conversationId);
      if (response.success) {
        setSelectedConversation(response.data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error loading conversation details:', error);
      toast.error('Failed to load conversation details');
    }
  };

  const exportConversations = () => {
    // Implementation for exporting conversations to CSV/Excel
    toast.info('Export feature coming soon');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'abandoned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFlowTypeIcon = (flowType) => {
    switch (flowType) {
      case 'property_search': return '🏠';
      case 'rent_inquiry': return '💬';
      case 'schedule_visit': return '📅';
      case 'bug_report': return '🐛';
      case 'feedback': return '💭';
      default: return '💬';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chatbot Dashboard</h1>
            <p className="text-gray-600">Monitor and analyze chatbot conversations</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportConversations}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_conversations}</p>
                </div>
                <FiMessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction Rate</p>
                  <p className="text-2xl font-bold text-green-600">{stats.satisfaction.satisfaction_rate}%</p>
                </div>
                <FiThumbsUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Escalated</p>
                  <p className="text-2xl font-bold text-red-600">{stats.status_breakdown.escalated}</p>
                </div>
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.recent_activity.conversations_last_7_days}</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </div>
                <FiTrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Conversations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Conversations</h2>
              
              <div className="flex items-center space-x-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="escalated">Escalated</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
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
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {conversations.map((conversation) => (
                  <tr key={conversation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">
                          {getFlowTypeIcon(conversation.flow_type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {conversation.session_id.substring(0, 8)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            Session ID
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {conversation.user_name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {conversation.user_email || 'No email'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {conversation.flow_type?.replace('_', ' ') || 'Unknown'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(conversation.status)}`}>
                        {conversation.status}
                      </span>
                      {conversation.has_escalation && (
                        <FiAlertCircle className="w-4 h-4 text-red-500 ml-2 inline" />
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {conversation.messages_count}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(conversation.created_at)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewConversationDetails(conversation.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Details Modal */}
      {showDetails && selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Conversation Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              {/* Conversation Info */}
              <div className="mb-6 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Session ID</p>
                  <p className="font-medium">{selectedConversation.conversation.session_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Flow Type</p>
                  <p className="font-medium capitalize">
                    {selectedConversation.conversation.flow_type?.replace('_', ' ') || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedConversation.conversation.status)}`}>
                    {selectedConversation.conversation.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                  <p className="font-medium">
                    {selectedConversation.conversation.is_satisfied === null ? 'Not rated' : 
                     selectedConversation.conversation.is_satisfied ? '👍 Satisfied' : '👎 Not satisfied'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Conversation Messages</h4>
                {selectedConversation.messages.map((message, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Step {message.step_number}</h5>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">Question:</p>
                      <p className="text-gray-900">{message.question}</p>
                    </div>
                    {message.answer && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 mb-1">Answer:</p>
                        <p className="text-gray-900 bg-blue-50 p-2 rounded">{message.answer}</p>
                      </div>
                    )}
                    {message.response_time && (
                      <div className="text-xs text-gray-500">
                        Response time: {message.response_time} seconds
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Escalations */}
              {selectedConversation.escalations && selectedConversation.escalations.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-gray-900">Escalations</h4>
                  {selectedConversation.escalations.map((escalation, index) => (
                    <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Reason</p>
                          <p className="font-medium">{escalation.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Priority</p>
                          <p className="font-medium capitalize">{escalation.priority}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-medium">{escalation.contact_name}</p>
                          <p className="text-sm text-gray-500">{escalation.contact_email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="font-medium">{formatDate(escalation.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotDashboard;