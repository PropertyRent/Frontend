import React, { useState, useEffect } from 'react';
import { 
  FiMail, 
  FiClock, 
  FiCheck, 
  FiUser,
  FiExternalLink,
  FiTrendingUp
} from 'react-icons/fi';

import { FaReply } from 'react-icons/fa';
import ContactService from '../../services/contactService';

const ContactSection = ({ onNavigateToContacts }) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    replied: 0,
    resolved: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      // Load statistics
      const statsResponse = await ContactService.getContactStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Load recent contacts
      const contactsResponse = await ContactService.getAllContacts({
        limit: 5,
        offset: 0
      });
      if (contactsResponse.success) {
        setRecentContacts(contactsResponse.data.contacts);
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
    } finally {
      setLoading(false);
    }
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiMail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Messages</h3>
              <p className="text-sm text-gray-600">Customer inquiries and messages</p>
            </div>
          </div>
          <button
            onClick={onNavigateToContacts}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <span>View All</span>
            <FiExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.replied}</div>
            <div className="text-sm text-gray-600">Replied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Recent Messages</h4>
        
        {recentContacts.length === 0 ? (
          <div className="text-center py-8">
            <FiMail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No contact messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentContacts.map((contact) => (
              <div key={contact.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.full_name}
                    </p>
                    {getStatusBadge(contact.status)}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">{contact.email}</p>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {contact.message}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    {formatDate(contact.created_at)}
                  </p>
                </div>
              </div>
            ))}

            {/* View More Button */}
            <button
              onClick={onNavigateToContacts}
              className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View all contact messages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;