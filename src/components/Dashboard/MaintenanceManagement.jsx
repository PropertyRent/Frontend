import React, { useState, useEffect } from 'react';
import { 
  FiTool, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiEye,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiSend,
  FiUpload,
  FiHome,
  FiMapPin,
  FiAlertTriangle,
  FiDollarSign,
  FiFileText,
  FiImage
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import MaintenanceService from '../../services/maintenanceService';
import ConfirmationModal from '../ConfirmationModal';

const MaintenanceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'view', 'edit', 'send'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'create'
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    requestId: null,
    requestTitle: '',
    isLoading: false
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    has_next: false,
    has_prev: false
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    in_progress: 0,
    completed: 0
  });

  // Form state for creating/editing maintenance requests
  const [formData, setFormData] = useState({
    tenant_name: '',
    tenant_phone: '',
    tenant_email: '',
    property_address: '',
    property_unit: '',
    issue_title: '',
    issue_description: '',
    priority: 'medium',
    contractor_email: '',
    contractor_name: '',
    contractor_phone: '',
    estimated_cost: '',
    notes: ''
  });

  // Photo upload state
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);

  // Send to contractor form state
  const [sendForm, setSendForm] = useState({
    additional_message: '',
    urgent: false
  });

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [searchTerm, activeTab, pagination.offset, filters]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await MaintenanceService.getAllRequests({
        limit: pagination.limit,
        offset: pagination.offset,
        search: searchTerm || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined
      });

      if (response.success) {
        setRequests(response.data.requests);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          has_next: response.data.pagination.has_next,
          has_prev: response.data.pagination.has_prev
        }));
        
        // Calculate statistics
        const statusCounts = response.data.requests.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {});
        
        setStats({
          total: response.data.pagination.total,
          pending: statusCounts.pending || 0,
          sent: statusCounts.sent_to_contractor || 0,
          in_progress: statusCounts.in_progress || 0,
          completed: statusCounts.completed || 0
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast.error('Failed to fetch maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleViewRequest = async (request) => {
    try {
      const response = await MaintenanceService.getRequestById(request.id);
      if (response.success) {
        setSelectedRequest(response.data);
        setModalMode('view');
        setShowModal(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to fetch request details');
    }
  };

  const handleEditRequest = async (request) => {
    try {
      const response = await MaintenanceService.getRequestById(request.id);
      if (response.success) {
        const data = response.data;
        setFormData({
          tenant_name: data.tenant_name || '',
          tenant_phone: data.tenant_phone || '',
          tenant_email: data.tenant_email || '',
          property_address: data.property_address || '',
          property_unit: data.property_unit || '',
          issue_title: data.issue_title || '',
          issue_description: data.issue_description || '',
          priority: data.priority || 'medium',
          contractor_email: data.contractor_email || '',
          contractor_name: data.contractor_name || '',
          contractor_phone: data.contractor_phone || '',
          estimated_cost: data.estimated_cost || '',
          notes: data.notes || ''
        });
        setSelectedRequest(data);
        setModalMode('edit');
        setShowModal(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to fetch request details');
    }
  };

  const handleSendToContractor = (request) => {
    setSelectedRequest(request);
    setSendForm({ additional_message: '', urgent: false });
    setModalMode('send');
    setShowModal(true);
  };

  const handleDeleteClick = (request) => {
    setConfirmModal({
      isOpen: true,
      requestId: request.id,
      requestTitle: request.issue_title,
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await MaintenanceService.deleteRequest(confirmModal.requestId);
      if (response.success) {
        toast.success('Maintenance request deleted successfully');
        fetchRequests();
        setConfirmModal({ isOpen: false, requestId: null, requestTitle: '', isLoading: false });
      } else {
        toast.error(response.message);
        setConfirmModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete maintenance request');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!confirmModal.isLoading) {
      setConfirmModal({ isOpen: false, requestId: null, requestTitle: '', isLoading: false });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tenant_name || !formData.property_address || !formData.issue_title || !formData.issue_description || !formData.contractor_email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (modalMode === 'create') {
        response = await MaintenanceService.createRequest(formData, photoFiles);
      } else {
        response = await MaintenanceService.updateRequest(selectedRequest.id, formData);
      }

      if (response.success) {
        toast.success(modalMode === 'create' ? 'Maintenance request created successfully' : 'Maintenance request updated successfully');
        setShowModal(false);
        fetchRequests();
        resetForm();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error saving maintenance request:', error);
      toast.error(`Failed to ${modalMode === 'create' ? 'create' : 'update'} maintenance request`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendSubmit = async () => {
    if (!selectedRequest) return;

    setSubmitting(true);
    try {
      const response = await MaintenanceService.sendToContractor(selectedRequest.id, sendForm);
      if (response.success) {
        toast.success('Maintenance request sent to contractor successfully');
        setShowModal(false);
        fetchRequests();
        setSendForm({ additional_message: '', urgent: false });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error sending to contractor:', error);
      toast.error('Failed to send maintenance request to contractor');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tenant_name: '',
      tenant_phone: '',
      tenant_email: '',
      property_address: '',
      property_unit: '',
      issue_title: '',
      issue_description: '',
      priority: 'medium',
      contractor_email: '',
      contractor_name: '',
      contractor_phone: '',
      estimated_cost: '',
      notes: ''
    });
    setPhotos([]);
    setPhotoFiles([]);
    setSelectedRequest(null);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + photoFiles.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          name: file.name,
          preview: e.target.result
        }]);
      };
      reader.readAsDataURL(file);

      setPhotoFiles(prev => [...prev, file]);
    });
  };

  const removePhoto = (photoId) => {
    const photoIndex = photos.findIndex(p => p.id === photoId);
    if (photoIndex !== -1) {
      setPhotos(prev => prev.filter(p => p.id !== photoId));
      setPhotoFiles(prev => prev.filter((_, index) => index !== photoIndex));
    }
  };

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    resetForm();
    setSendForm({ additional_message: '', urgent: false });
  };

  const StatCard = ({ title, count, color, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#F97316';
      case 'urgent': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'sent_to_contractor': return '#3B82F6';
      case 'in_progress': return '#8B5CF6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
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

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage maintenance requests for contractors
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreateRequest}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Request
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Requests" count={stats.total} color="#3B82F6" icon={FiTool} />
        <StatCard title="Pending" count={stats.pending} color="#F59E0B" icon={FiAlertTriangle} />
        <StatCard title="Sent to Contractor" count={stats.sent} color="#8B5CF6" icon={FiSend} />
        <StatCard title="Completed" count={stats.completed} color="#10B981" icon={FiCheck} />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tenant, property, or issue title..."
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
              <option value="pending">Pending</option>
              <option value="sent_to_contractor">Sent to Contractor</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
        </div>
        
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <FiTool className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance requests found</h3>
            <p className="text-gray-500">Create your first maintenance request to get started.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue & Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contractor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {request.issue_title}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiHome className="w-3 h-3 mr-1" />
                            {request.property_address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {request.tenant_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.contractor_name || request.contractor_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getPriorityColor(request.priority) }}
                        >
                          {request.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        >
                          {request.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditRequest(request)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Edit Request"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleSendToContractor(request)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Send to Contractor"
                            >
                              <FiSend className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(request)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete Request"
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

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                    disabled={!pagination.has_prev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                    disabled={!pagination.has_next}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{pagination.offset + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.offset + pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                        disabled={!pagination.has_prev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                        disabled={!pagination.has_next}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'create' ? 'Create Maintenance Request' : 
                 modalMode === 'edit' ? 'Edit Maintenance Request' :
                 modalMode === 'send' ? 'Send to Contractor' : 'Request Details'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {modalMode === 'view' && selectedRequest && (
                <div className="space-y-6">
                  {/* Request Header */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {selectedRequest.issue_title}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <span 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: getPriorityColor(selectedRequest.priority) }}
                          >
                            {selectedRequest.priority.toUpperCase()} Priority
                          </span>
                          <span 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: getStatusColor(selectedRequest.status) }}
                          >
                            {selectedRequest.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {selectedRequest.estimated_cost && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Estimated Cost</p>
                          <p className="text-xl font-bold text-green-600">${selectedRequest.estimated_cost}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="font-medium text-gray-900 mb-2">Issue Description</h4>
                      <p className="text-gray-700">{selectedRequest.issue_description}</p>
                    </div>
                  </div>

                  {/* Property & Tenant Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiHome className="w-5 h-5 mr-2 text-blue-600" />
                        Property Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Address</label>
                          <p className="text-gray-900">{selectedRequest.property_address}</p>
                        </div>
                        {selectedRequest.property_unit && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Unit</label>
                            <p className="text-gray-900">{selectedRequest.property_unit}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiUser className="w-5 h-5 mr-2 text-green-600" />
                        Tenant Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p className="text-gray-900">{selectedRequest.tenant_name}</p>
                        </div>
                        {selectedRequest.tenant_email && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-gray-900">{selectedRequest.tenant_email}</p>
                          </div>
                        )}
                        {selectedRequest.tenant_phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <p className="text-gray-900">{selectedRequest.tenant_phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contractor Info */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiTool className="w-5 h-5 mr-2 text-purple-600" />
                      Contractor Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{selectedRequest.contractor_email}</p>
                      </div>
                      {selectedRequest.contractor_name && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Name</label>
                          <p className="text-gray-900">{selectedRequest.contractor_name}</p>
                        </div>
                      )}
                      {selectedRequest.contractor_phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone</label>
                          <p className="text-gray-900">{selectedRequest.contractor_phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photos */}
                  {selectedRequest.photos && selectedRequest.photos.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiImage className="w-5 h-5 mr-2 text-indigo-600" />
                        Photos ({selectedRequest.photos.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {selectedRequest.photos.map((photo, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={photo}
                              alt={`Issue photo ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Notes */}
                  {selectedRequest.notes && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiFileText className="w-5 h-5 mr-2 text-yellow-600" />
                        Additional Notes
                      </h4>
                      <p className="text-gray-700">{selectedRequest.notes}</p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <label className="font-medium text-gray-500">Created</label>
                        <p className="text-gray-900">{formatDate(selectedRequest.created_at)}</p>
                      </div>
                      <div>
                        <label className="font-medium text-gray-500">Updated</label>
                        <p className="text-gray-900">{formatDate(selectedRequest.updated_at)}</p>
                      </div>
                      {selectedRequest.sent_at && (
                        <div>
                          <label className="font-medium text-gray-500">Sent</label>
                          <p className="text-gray-900">{formatDate(selectedRequest.sent_at)}</p>
                        </div>
                      )}
                      {selectedRequest.completed_at && (
                        <div>
                          <label className="font-medium text-gray-500">Completed</label>
                          <p className="text-gray-900">{formatDate(selectedRequest.completed_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {modalMode === 'send' && selectedRequest && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Send Request to Contractor</h4>
                    <p className="text-blue-800 text-sm">
                      This will send an email to <strong>{selectedRequest.contractor_email}</strong> with all the maintenance request details.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      value={sendForm.additional_message}
                      onChange={(e) => setSendForm(prev => ({ ...prev, additional_message: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional instructions or notes for the contractor..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={sendForm.urgent}
                      onChange={(e) => setSendForm(prev => ({ ...prev, urgent: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                      Mark as urgent (will be highlighted in the email)
                    </label>
                  </div>
                </div>
              )}

              {(modalMode === 'create' || modalMode === 'edit') && (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Tenant Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiUser className="w-5 h-5 mr-2 text-green-600" />
                      Tenant Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tenant Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.tenant_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, tenant_name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tenant Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.tenant_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, tenant_phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tenant Email
                        </label>
                        <input
                          type="email"
                          value={formData.tenant_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, tenant_email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiHome className="w-5 h-5 mr-2 text-blue-600" />
                      Property Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.property_address}
                          onChange={(e) => setFormData(prev => ({ ...prev, property_address: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.property_unit}
                          onChange={(e) => setFormData(prev => ({ ...prev, property_unit: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Issue Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiAlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                      Issue Details
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Issue Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.issue_title}
                            onChange={(e) => setFormData(prev => ({ ...prev, issue_title: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Priority <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Issue Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.issue_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, issue_description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contractor Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiTool className="w-5 h-5 mr-2 text-purple-600" />
                      Contractor Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contractor Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={formData.contractor_email}
                          onChange={(e) => setFormData(prev => ({ ...prev, contractor_email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contractor Name
                        </label>
                        <input
                          type="text"
                          value={formData.contractor_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, contractor_name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contractor Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.contractor_phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, contractor_phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FiFileText className="w-5 h-5 mr-2 text-yellow-600" />
                      Additional Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Cost ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.estimated_cost}
                          onChange={(e) => setFormData(prev => ({ ...prev, estimated_cost: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any additional notes or special instructions..."
                      />
                    </div>
                  </div>

                  {/* Photo Upload (only for create mode) */}
                  {modalMode === 'create' && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FiImage className="w-5 h-5 mr-2 text-indigo-600" />
                        Photos (Optional)
                      </h3>
                      
                      <div className="mb-4">
                        <label className="block">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="sr-only"
                          />
                          <div className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload photos or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Maximum 10 photos, 5MB each
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* Photo Previews */}
                      {photos.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {photos.map((photo) => (
                            <div key={photo.id} className="relative">
                              <img
                                src={photo.preview}
                                alt={photo.name}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(photo.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <FiX className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              
              {modalMode === 'send' && (
                <button
                  onClick={handleSendSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      <span>Send to Contractor</span>
                    </>
                  )}
                </button>
              )}
              
              {(modalMode === 'create' || modalMode === 'edit') && (
                <button
                  onClick={handleFormSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>{modalMode === 'create' ? 'Creating...' : 'Updating...'}</span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      <span>{modalMode === 'create' ? 'Create Request' : 'Update Request'}</span>
                    </>
                  )}
                </button>
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
        title="Delete Maintenance Request"
        message={`Are you sure you want to delete the maintenance request "${confirmModal.requestTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
};

export default MaintenanceManagement;