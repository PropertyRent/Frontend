import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiMessageSquare,
  FiCheck,
  FiX,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiExternalLink,
  FiHome,
  FiEdit2,
  FiEye
} from 'react-icons/fi';
import ScheduleMeetingService from '../../services/scheduleMeetingService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ConfirmationModal';

const MEETING_STATUSES = {
  pending: { color: 'yellow', label: 'Pending' },
  replied: { color: 'blue', label: 'Replied' },
  approved: { color: 'green', label: 'Approved' },
  rejected: { color: 'red', label: 'Rejected' },
  completed: { color: 'purple', label: 'Completed' },
  cancelled: { color: 'gray', label: 'Cancelled' }
};

const MeetingManagement = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'reply'
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    propertyId: '',
    search: ''
  });

  // Reply form state
  const [replyForm, setReplyForm] = useState({
    message: '',
    action: null // 'approved', 'rejected', or null for just reply
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    meetingId: null,
    meetingTitle: '',
    isLoading: false
  });
  const [replyLoading, setReplyLoading] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0
  });

  useEffect(() => {
    loadMeetings();
    loadStats();
  }, [filters]);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const response = await ScheduleMeetingService.getAllMeetingsAdmin(
        filters.status || null,
        filters.propertyId || null
      );

      if (response.success) {
        let filteredMeetings = response.data.meetings || [];
        
        // Apply search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredMeetings = filteredMeetings.filter(meeting => 
            meeting.full_name.toLowerCase().includes(searchTerm) ||
            meeting.email.toLowerCase().includes(searchTerm) ||
            meeting.property?.title.toLowerCase().includes(searchTerm)
          );
        }
        
        setMeetings(filteredMeetings);
      } else {
        toast.error(response.message || 'Failed to load meetings');
      }
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error(error.message || 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Calculate stats from current meetings
      const response = await ScheduleMeetingService.getAllMeetingsAdmin();
      if (response.success) {
        const allMeetings = response.data.meetings || [];
        const stats = {
          total: allMeetings.length,
          pending: allMeetings.filter(m => m.status === 'pending').length,
          approved: allMeetings.filter(m => m.status === 'approved').length,
          completed: allMeetings.filter(m => m.status === 'completed').length,
          rejected: allMeetings.filter(m => m.status === 'rejected').length,
          cancelled: allMeetings.filter(m => m.status === 'cancelled').length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setModalMode('view');
    setShowModal(true);
  };

  const handleReplyToMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setModalMode('reply');
    setReplyForm({ message: '', action: null });
    setShowModal(true);
  };

  const handleSubmitReply = async () => {
    if (!replyForm.message.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setReplyLoading(true);
    try {
      const response = await ScheduleMeetingService.adminReplyToMeeting(
        selectedMeeting.id,
        {
          message: replyForm.message.trim(),
          action: replyForm.action
        }
      );

      if (response.success) {
        toast.success('Reply sent successfully');
        setShowModal(false);
        loadMeetings();
        loadStats();
      } else {
        toast.error(response.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleCompleteMeeting = async (meetingId) => {
    if (!confirm('Mark this meeting as completed?')) return;

    try {
      const response = await ScheduleMeetingService.adminCompleteMeeting(meetingId);
      if (response.success) {
        toast.success('Meeting marked as completed');
        loadMeetings();
        loadStats();
      } else {
        toast.error(response.message || 'Failed to complete meeting');
      }
    } catch (error) {
      console.error('Error completing meeting:', error);
      toast.error(error.message || 'Failed to complete meeting');
    }
  };

  const handleDeleteClick = (meeting) => {
    setConfirmModal({
      isOpen: true,
      meetingId: meeting.id,
      meetingTitle: `${meeting.user_name}'s meeting`,
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await ScheduleMeetingService.adminDeleteMeeting(confirmModal.meetingId);
      if (response.success) {
        toast.success('Meeting deleted successfully');
        loadMeetings();
        loadStats();
        setConfirmModal({ isOpen: false, meetingId: null, meetingTitle: '', isLoading: false });
      } else {
        toast.error(response.message || 'Failed to delete meeting');
        setConfirmModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error(error.message || 'Failed to delete meeting');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!confirmModal.isLoading) {
      setConfirmModal({ isOpen: false, meetingId: null, meetingTitle: '', isLoading: false });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = MEETING_STATUSES[status] || { color: 'gray', label: status };
    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[statusConfig.color]}`}>
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meeting Management</h1>
        <p className="text-gray-600">Manage property viewing appointments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or property..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {Object.entries(MEETING_STATUSES).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={loadMeetings}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Meetings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Scheduled Meetings</h2>
          <p className="text-sm text-gray-600">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading meetings...</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="p-8 text-center">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No meetings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{meeting.full_name}</div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FiMail className="w-3 h-3 mr-1" />
                          {meeting.email}
                        </div>
                        {meeting.phone && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FiPhone className="w-3 h-3 mr-1" />
                            {meeting.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {meeting.property?.title || 'Property Not Found'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {meeting.property?.property_type} • ${meeting.property?.price?.toLocaleString()}/mo
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <FiCalendar className="w-3 h-3 mr-1" />
                          {formatDate(meeting.meeting_date)}
                        </div>
                        <div className="flex items-center">
                          <FiClock className="w-3 h-3 mr-1" />
                          {formatTime(meeting.meeting_time)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(meeting.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(meeting.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewMeeting(meeting)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {meeting.status === 'pending' && (
                          <button
                            onClick={() => handleReplyToMeeting(meeting)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Reply"
                          >
                            <FiMessageSquare className="w-4 h-4" />
                          </button>
                        )}
                        {meeting.status === 'approved' && (
                          <button
                            onClick={() => handleCompleteMeeting(meeting.id)}
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="Mark as Completed"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(meeting)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Meeting"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedMeeting && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'view' ? 'Meeting Details' : 'Reply to Meeting Request'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {modalMode === 'view' ? (
                // View Mode
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium text-gray-900">{selectedMeeting.full_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium text-gray-900">{selectedMeeting.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium text-gray-900">{selectedMeeting.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <div className="mt-1">{getStatusBadge(selectedMeeting.status)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Meeting Details */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Meeting Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <p className="font-medium text-gray-900">{formatDate(selectedMeeting.meeting_date)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Time:</span>
                        <p className="font-medium text-gray-900">{formatTime(selectedMeeting.meeting_time)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">Created:</span>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedMeeting.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Property Information */}
                  {selectedMeeting.property && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Property</h4>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2">{selectedMeeting.property.title}</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{selectedMeeting.property.property_type} • {selectedMeeting.property.bedrooms} bed • {selectedMeeting.property.bathrooms} bath</p>
                          <p className="font-medium text-blue-600">${selectedMeeting.property.price?.toLocaleString()}/month</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  {selectedMeeting.message && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">User Message</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{selectedMeeting.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Admin Reply */}
                  {selectedMeeting.admin_message && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Admin Reply</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-900 text-sm whitespace-pre-wrap">{selectedMeeting.admin_message}</p>
                        {selectedMeeting.admin_reply_date && (
                          <p className="text-blue-700 text-xs mt-2">
                            Replied on: {new Date(selectedMeeting.admin_reply_date).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Reply Mode
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{selectedMeeting.full_name}</h4>
                    <p className="text-sm text-gray-600">{selectedMeeting.email}</p>
                    <p className="text-sm text-gray-600">
                      Meeting: {formatDate(selectedMeeting.meeting_date)} at {formatTime(selectedMeeting.meeting_time)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reply Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={replyForm.message}
                      onChange={(e) => setReplyForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      placeholder="Enter your reply message..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value=""
                          checked={replyForm.action === null}
                          onChange={() => setReplyForm(prev => ({ ...prev, action: null }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Send reply only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="approved"
                          checked={replyForm.action === 'approved'}
                          onChange={() => setReplyForm(prev => ({ ...prev, action: 'approved' }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-green-700">Approve meeting</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="action"
                          value="rejected"
                          checked={replyForm.action === 'rejected'}
                          onChange={() => setReplyForm(prev => ({ ...prev, action: 'rejected' }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-red-700">Reject meeting</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReply}
                      disabled={replyLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {replyLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiMessageSquare className="w-4 h-4" />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Meeting"
        message={`Are you sure you want to delete "${confirmModal.meetingTitle}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={confirmModal.isLoading}
        type="danger"
      />
    </div>
  );
};

export default MeetingManagement;