import React, { useState, useEffect, useContext } from 'react';
import { 
  FiCalendar, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiEye,
  FiExternalLink,
  FiSettings,
  FiUsers,
  FiClock,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiBarChart2,
  FiCode,
  FiLink,
  FiHome,
  FiActivity,
  FiTrendingUp
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import TidyCalServiceInstance, { TidyCalService } from '../../services/tidyCalService';
import { PropertyContext } from '../../stores/propertyStore';

const TidyCalManagement = () => {
  const { properties, fetchProperties } = useContext(PropertyContext);
  
  // State management
  const [bookingPages, setBookingPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view', 'analytics', 'embed'
  const [selectedPage, setSelectedPage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('pages'); // 'pages', 'analytics', 'settings'
  
  // Integration status
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // Form state for booking page creation/editing
  const [form, setForm] = useState({
    property_id: '',
    page_name: '',
    description: '',
    duration_minutes: 60,
    buffer_before: 15,
    buffer_after: 15,
    is_public: true,
    custom_questions: [],
    notification_settings: {}
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0
  });

  useEffect(() => {
    fetchBookingPages();
    fetchIntegrationStatus();
    if (properties.length === 0) {
      fetchProperties();
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // === DATA FETCHING ===

  const fetchBookingPages = async () => {
    setLoading(true);
    try {
      const response = await TidyCalServiceInstance.getAllBookingPages();
      
      if (response.success) {
        setBookingPages(response.data.booking_pages);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      }
    } catch (error) {
      console.error('Error fetching booking pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntegrationStatus = async () => {
    try {
      const response = await TidyCalServiceInstance.getIntegrationStatus();
      if (response.success) {
        setIntegrationStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching integration status:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await TidyCalServiceInstance.getBookingAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // === FORM HANDLERS ===

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setForm({
      property_id: '',
      page_name: '',
      description: '',
      duration_minutes: 60,
      buffer_before: 15,
      buffer_after: 15,
      is_public: true,
      custom_questions: [],
      notification_settings: {}
    });
  };

  const populateForm = (page) => {
    setForm({
      property_id: page.property_id,
      page_name: page.page_name,
      description: page.description || '',
      duration_minutes: page.duration_minutes,
      buffer_before: page.buffer_before,
      buffer_after: page.buffer_after,
      is_public: page.is_public,
      custom_questions: page.custom_questions || [],
      notification_settings: page.notification_settings || {}
    });
  };

  // === MODAL HANDLERS ===

  const openCreateModal = () => {
    resetForm();
    setModalMode('create');
    setSelectedPage(null);
    setShowModal(true);
  };

  const openEditModal = (page) => {
    populateForm(page);
    setSelectedPage(page);
    setModalMode('edit');
    setShowModal(true);
  };

  const openViewModal = (page) => {
    setSelectedPage(page);
    setModalMode('view');
    setShowModal(true);
  };

  const openEmbedModal = (page) => {
    setSelectedPage(page);
    setModalMode('embed');
    setShowModal(true);
  };

  const openAnalyticsModal = (page) => {
    setSelectedPage(page);
    setModalMode('analytics');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPage(null);
    resetForm();
    setSubmitting(false);
  };

  // === CRUD OPERATIONS ===

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate form
    const validation = TidyCalService.validateBookingPageData(form);
    if (!validation.isValid) {
      Object.values(validation.errors).forEach(error => toast.error(error));
      setSubmitting(false);
      return;
    }

    try {
      let response;
      if (modalMode === 'create') {
        response = await TidyCalServiceInstance.createBookingPage(form.property_id, form);
      } else if (modalMode === 'edit') {
        response = await TidyCalServiceInstance.updateBookingPage(selectedPage.id, form);
      }

      if (response.success) {
        await fetchBookingPages();
        closeModal();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this booking page? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await TidyCalServiceInstance.deleteBookingPage(pageId);
      if (response.success) {
        await fetchBookingPages();
      }
    } catch (error) {
      console.error('Error deleting booking page:', error);
    }
  };

  // === FILTERING ===

  const filteredPages = bookingPages.filter(page => {
    const matchesSearch = 
      page.page_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // === RENDER HELPERS ===

  const renderStatusBadge = (status) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TidyCalService.getStatusColorClass(status)}`}>
      {TidyCalService.formatBookingStatus(status)}
    </span>
  );

  const renderBookingPageCard = (page) => (
    <div key={page.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{page.page_name}</h3>
          <p className="text-sm text-gray-600 mb-2">{page.property_title}</p>
          {page.description && (
            <p className="text-sm text-gray-500 mb-3">{page.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {renderStatusBadge(page.status)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <FiClock className="w-4 h-4 mr-2" />
          {page.duration_minutes} minutes
        </div>
        <div className="flex items-center">
          <FiUsers className="w-4 h-4 mr-2" />
          {page.total_bookings} bookings
        </div>
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 mr-2" />
          {page.last_booking_date ? TidyCalService.formatDate(page.last_booking_date) : 'No bookings yet'}
        </div>
        <div className="flex items-center">
          <FiActivity className="w-4 h-4 mr-2" />
          {page.is_public ? 'Public' : 'Private'}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openViewModal(page)}
            className="text-blue-600 hover:text-blue-800 p-1 rounded"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEditModal(page)}
            className="text-green-600 hover:text-green-800 p-1 rounded"
            title="Edit"
          >
            <FiEdit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEmbedModal(page)}
            className="text-purple-600 hover:text-purple-800 p-1 rounded"
            title="Get Embed Code"
          >
            <FiCode className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAnalyticsModal(page)}
            className="text-yellow-600 hover:text-yellow-800 p-1 rounded"
            title="View Analytics"
          >
            <FiBarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(page.id)}
            className="text-red-600 hover:text-red-800 p-1 rounded"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <a
            href={page.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
          >
            <FiExternalLink className="w-3 h-3 mr-1" />
            Book Now
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">TidyCal Management</h2>
          <p className="text-gray-600 mt-1">Manage property viewing bookings with TidyCal integration</p>
        </div>
        
        {activeTab === 'pages' && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Booking Page
          </button>
        )}
      </div>

      {/* Integration Status Banner */}
      {integrationStatus && (
        <div className={`p-4 rounded-lg border ${
          integrationStatus.is_configured 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {integrationStatus.is_configured ? (
                <FiCheck className="w-5 h-5 text-green-600 mr-3" />
              ) : (
                <FiAlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              )}
              <div>
                <h3 className={`font-medium ${
                  integrationStatus.is_configured ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  TidyCal Integration {integrationStatus.is_configured ? 'Active' : 'Needs Configuration'}
                </h3>
                <p className={`text-sm ${
                  integrationStatus.is_configured ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {integrationStatus.is_configured 
                    ? `${integrationStatus.total_booking_pages} booking pages, ${integrationStatus.total_bookings} total bookings`
                    : 'API key or webhook configuration missing'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-gray-600">
                API: {integrationStatus.api_key_present ? '✓' : '✗'}
              </div>
              <div className="text-gray-600">
                Webhook: {integrationStatus.webhook_configured ? '✓' : '✗'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'pages', label: 'Booking Pages', icon: FiCalendar },
            { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
            { id: 'settings', label: 'Settings', icon: FiSettings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search booking pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Booking Pages Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Booking Pages Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No booking pages match your search.' : 'Create your first booking page to get started.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create Booking Page
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPages.map(renderBookingPageCard)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {analytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Total Bookings</h3>
                  <FiUsers className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.total_bookings}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Confirmed</h3>
                  <FiCheck className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.confirmed_bookings}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Completed</h3>
                  <FiActivity className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.completed_bookings}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Avg Duration</h3>
                  <FiClock className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{analytics.average_duration_minutes}m</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center py-12">
              <FiLoader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TidyCal API Status
                </label>
                <div className="flex items-center space-x-2">
                  {integrationStatus?.api_key_present ? (
                    <>
                      <FiCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">API Key Configured</span>
                    </>
                  ) : (
                    <>
                      <FiX className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">API Key Missing</span>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Configuration
                </label>
                <div className="flex items-center space-x-2">
                  {integrationStatus?.webhook_configured ? (
                    <>
                      <FiCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Webhook Configured</span>
                    </>
                  ) : (
                    <>
                      <FiX className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Webhook Not Configured</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'create' && 'Create Booking Page'}
                {modalMode === 'edit' && 'Edit Booking Page'}
                {modalMode === 'view' && 'Booking Page Details'}
                {modalMode === 'embed' && 'Embed Code'}
                {modalMode === 'analytics' && 'Page Analytics'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {(modalMode === 'create' || modalMode === 'edit') && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property *
                    </label>
                    <select
                      name="property_id"
                      value={form.property_id}
                      onChange={handleFormChange}
                      required
                      disabled={modalMode === 'edit'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select a property</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>
                          {property.title} - {property.city}, {property.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Name *
                    </label>
                    <input
                      type="text"
                      name="page_name"
                      value={form.page_name}
                      onChange={handleFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Property Viewing - Downtown Apartment"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the booking (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="duration_minutes"
                        value={form.duration_minutes}
                        onChange={handleFormChange}
                        min="15"
                        max="480"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer Before (minutes)
                      </label>
                      <input
                        type="number"
                        name="buffer_before"
                        value={form.buffer_before}
                        onChange={handleFormChange}
                        min="0"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer After (minutes)
                      </label>
                      <input
                        type="number"
                        name="buffer_after"
                        value={form.buffer_after}
                        onChange={handleFormChange}
                        min="0"
                        max="120"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_public"
                      id="is_public"
                      checked={form.is_public}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                      Make this booking page publicly accessible
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      {submitting ? (
                        <FiLoader className="inline w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FiCheck className="inline w-4 h-4 mr-2" />
                      )}
                      {modalMode === 'create' ? 'Create Booking Page' : 'Update Booking Page'}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={submitting}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {modalMode === 'view' && selectedPage && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Page Name:</strong> {selectedPage.page_name}</div>
                    <div><strong>Property:</strong> {selectedPage.property_title}</div>
                    <div><strong>Duration:</strong> {selectedPage.duration_minutes} minutes</div>
                    <div><strong>Status:</strong> {renderStatusBadge(selectedPage.status)}</div>
                    <div><strong>Total Bookings:</strong> {selectedPage.total_bookings}</div>
                    <div><strong>Public:</strong> {selectedPage.is_public ? 'Yes' : 'No'}</div>
                  </div>
                  
                  {selectedPage.description && (
                    <div>
                      <strong>Description:</strong>
                      <p className="mt-1 text-gray-600">{selectedPage.description}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <strong>Booking URL:</strong>
                    <div className="mt-1 flex items-center space-x-2">
                      <input
                        type="text"
                        value={selectedPage.booking_url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                      />
                      <a
                        href={selectedPage.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Open booking page"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {modalMode === 'embed' && selectedPage && (
                <EmbedCodeModal page={selectedPage} />
              )}

              {modalMode === 'analytics' && selectedPage && (
                <AnalyticsModal page={selectedPage} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// === MODAL COMPONENTS ===

const EmbedCodeModal = ({ page }) => {
  const [embedData, setEmbedData] = useState(null);
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('600px');
  const [loading, setLoading] = useState(false);

  const fetchEmbedCode = async () => {
    setLoading(true);
    try {
      const response = await TidyCalServiceInstance.getBookingPageEmbed(page.id, width, height);
      if (response.success) {
        setEmbedData(response.data);
      }
    } catch (error) {
      console.error('Error fetching embed code:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmbedCode();
  }, [page.id, width, height]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="100%"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="600px"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <FiLoader className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : embedData && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Direct URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={embedData.booking_url}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() => copyToClipboard(embedData.booking_url)}
                className="p-2 text-blue-600 hover:text-blue-800"
                title="Copy URL"
              >
                <FiLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
            <div className="relative">
              <textarea
                value={embedData.embed_code}
                readOnly
                rows={6}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(embedData.embed_code)}
                className="absolute top-2 right-2 p-2 text-blue-600 hover:text-blue-800"
                title="Copy embed code"
              >
                <FiCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsModal = ({ page }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPageAnalytics = async () => {
      setLoading(true);
      try {
        const response = await TidyCalServiceInstance.getBookingAnalytics(page.id);
        if (response.success) {
          setAnalytics(response.data);
        }
      } catch (error) {
        console.error('Error fetching page analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageAnalytics();
  }, [page.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <FiLoader className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-700">Total Bookings</h4>
            <FiUsers className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{analytics.total_bookings}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-green-700">Completion Rate</h4>
            <FiTrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-900">{analytics.completion_rate?.toFixed(1)}%</p>
        </div>
      </div>

      {analytics.most_popular_times && analytics.most_popular_times.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Most Popular Times</h4>
          <div className="space-y-2">
            {analytics.most_popular_times.slice(0, 5).map((time, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm">{time.time}</span>
                <span className="text-sm font-medium">{time.count} bookings</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TidyCalManagement;