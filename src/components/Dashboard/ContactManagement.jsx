import React, { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiUser, 
  FiClock, 
  FiMessageSquare, 
  FiSearch, 
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiTrash2,
  FiEye,
  FiSend
} from 'react-icons/fi';
import { FaReply } from 'react-icons/fa';
import ContactService from '../../services/contactService';
import toast from 'react-hot-toast';

const ContactManagement = () => {
  // State management
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    has_next: false,
    has_prev: false
  });

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    replied: 0,
    resolved: 0
  });

  // Load contacts on component mount and when filters/pagination change
  useEffect(() => {
    loadContacts();
  }, [filters, pagination.offset]);

  // Load contact statistics
  useEffect(() => {
    loadStats();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await ContactService.getAllContacts({
        limit: pagination.limit,
        offset: pagination.offset,
        status: filters.status || null,
        search: filters.search || null
      });

      if (response.success) {
        setContacts(response.data.contacts);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          has_next: response.data.pagination.has_next,
          has_prev: response.data.pagination.has_prev
        }));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ContactService.getContactStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      const response = await ContactService.updateContactStatus(contactId, newStatus);
      if (response.success) {
        toast.success('Status updated successfully');
        loadContacts();
        loadStats();
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact(response.data);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setReplyLoading(true);
    try {
      const response = await ContactService.replyToContact(selectedContact.id, replyMessage.trim());
      if (response.success) {
        toast.success('Reply sent successfully');
        setShowReplyModal(false);
        setReplyMessage('');
        loadContacts();
        loadStats();
        setSelectedContact(response.data);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      const response = await ContactService.deleteContact(contactId);
      if (response.success) {
        toast.success('Contact deleted successfully');
        loadContacts();
        loadStats();
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact(null);
        }
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: FiClock, label: 'Pending' },
      replied: { color: 'bg-blue-100 text-blue-800', icon: FaReply, label: 'Replied' },
      resolved: { color: 'bg-green-100 text-green-800', icon: FiCheck, label: 'Resolved' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
        <p className="text-gray-600">Manage customer inquiries and contact messages</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiMail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaReply className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.replied}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
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
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <button
            onClick={loadContacts}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Contact Messages</h2>
            <p className="text-sm text-gray-600">
              Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
            </p>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading contacts...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center">
                <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No contact messages found</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{contact.full_name}</span>
                    </div>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.email}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {contact.message}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiClock className="w-3 h-3" />
                    {formatDate(contact.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => handlePageChange(pagination.offset - pagination.limit)}
                disabled={!pagination.has_prev}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
              </span>

              <button
                onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                disabled={!pagination.has_next}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
          </div>

          {selectedContact ? (
            <div className="p-4">
              {/* Contact Info */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedContact.full_name}</h3>
                    <p className="text-gray-600">{selectedContact.email}</p>
                  </div>
                  {getStatusBadge(selectedContact.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium">{formatDate(selectedContact.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Updated</p>
                    <p className="font-medium">{formatDate(selectedContact.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Message</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Admin Reply */}
              {selectedContact.admin_reply && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Reply</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.admin_reply}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Replied on {formatDate(selectedContact.admin_reply_date)}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowReplyModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <FaReply className="w-4 h-4" />
                  Reply
                </button>

                {selectedContact.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'replied')}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <FiCheck className="w-4 h-4" />
                    Mark Replied
                  </button>
                )}

                {selectedContact.status !== 'resolved' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedContact.id, 'resolved')}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                  >
                    <FiCheck className="w-4 h-4" />
                    Mark Resolved
                  </button>
                )}

                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <FiEye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a contact to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reply to {selectedContact?.full_name}
                </h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply Message
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your reply message here..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReply}
                  disabled={replyLoading || !replyMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {replyLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiSend className="w-4 h-4" />
                  )}
                  {replyLoading ? 'Sending...' : 'Send Reply'}
                </button>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;