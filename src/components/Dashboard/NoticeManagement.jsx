import React, { useState, useEffect, useRef } from 'react';
import { 
  FiBell, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiEye, 
  FiEyeOff,
  FiDownload,
  FiFileText,
  FiImage,
  FiX,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import NoticeService from '../../services/noticeService';

const NoticeManagement = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasNext: false,
    hasPrev: false
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null
  });
  const [formErrors, setFormErrors] = useState({});

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    fetchNotices();
  }, [pagination.offset, searchTerm]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await NoticeService.getAllNotices({
        limit: pagination.limit,
        offset: pagination.offset,
        search: searchTerm || undefined
      });

      if (response.success) {
        setNotices(response.data.notices);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          hasNext: response.data.pagination.total > pagination.offset + pagination.limit,
          hasPrev: pagination.offset > 0
        }));

        // Calculate stats
        const totalNotices = response.data.notices.length;
        const activeNotices = response.data.notices.filter(n => n.is_active).length;
        setStats({
          total: response.data.pagination.total,
          active: activeNotices,
          inactive: totalNotices - activeNotices
        });
      } else {
        toast.error(response.message);
        setNotices([]);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file: null
    });
    setFormErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openModal = (mode, notice = null) => {
    setModalMode(mode);
    setSelectedNotice(notice);
    
    if (mode === 'edit' && notice) {
      setFormData({
        title: notice.title,
        description: notice.description || '',
        file: null
      });
    } else if (mode === 'create') {
      resetForm();
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotice(null);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }

    if (formData.file) {
      const validation = NoticeService.validateFile(formData.file);
      if (!validation.isValid) {
        errors.file = validation.error;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      let response;
      
      if (modalMode === 'create') {
        response = await NoticeService.createNotice(formData);
      } else if (modalMode === 'edit') {
        response = await NoticeService.updateNotice(selectedNotice.id, formData);
      }

      if (response.success) {
        toast.success(response.message);
        closeModal();
        fetchNotices();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (notice) => {
    if (!confirm(`Are you sure you want to delete "${notice.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await NoticeService.deleteNotice(notice.id);
      
      if (response.success) {
        toast.success('Notice deleted successfully');
        fetchNotices();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const handleToggleActive = async (notice) => {
    try {
      const response = await NoticeService.toggleNoticeActive(notice.id);
      
      if (response.success) {
        toast.success(response.message);
        fetchNotices();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error toggling notice status:', error);
      toast.error('Failed to update notice status');
    }
  };

  const handleDownload = async (notice) => {
    if (notice.original_filename) {
        toast.loading('Preparing download...', { id: 'downloadToast' });
      const response = await NoticeService.downloadNoticeFile(notice.id, true); // true for admin
      
      if (response.success) {
        toast.dismiss('downloadToast');
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrev) {
      setPagination(prev => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit)
      }));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setPagination(prev => ({
        ...prev,
        offset: prev.offset + prev.limit
      }));
    }
  };

  const getFileIcon = (filename) => {
    if (NoticeService.isImageFile(filename)) {
      return <FiImage className="w-4 h-4" />;
    } else if (NoticeService.isDocumentFile(filename)) {
      return <FiFileText className="w-4 h-4" />;
    }
    return <FiFileText className="w-4 h-4" />;
  };

  // Skeleton loading component
  const NoticeSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
        <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
              <p className="text-gray-600">Manage system notices and announcements</p>
            </div>
          </div>
          <button
            onClick={() => openModal('create')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Notice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiBell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiEye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Notices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FiEyeOff className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Notices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notices..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>
          
          {!loading && (
            <div className="text-sm text-gray-600">
              {pagination.total > 0 ? (
                <>
                  Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} notices
                </>
              ) : (
                'No notices found'
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {loading ? (
                [...Array(5)].map((_, index) => <NoticeSkeleton key={index} />)
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FiBell className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500">No notices found</p>
                      {searchTerm && (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setPagination(prev => ({ ...prev, offset: 0 }));
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-700"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {notice.original_filename && (
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              {getFileIcon(notice.original_filename)}
                            </div>
                          )}
                        </div>
                        <div className={notice.original_filename ? "ml-3" : ""}>
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {notice.title}
                          </div>
                          {notice.original_filename && (
                            <div className="text-xs text-gray-500">
                              Has attachment
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {notice.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        notice.is_active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {notice.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(notice.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal('view', notice)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => openModal('edit', notice)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                          title="Edit Notice"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleToggleActive(notice)}
                          className={`${
                            notice.is_active 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          } p-1 rounded`}
                          title={notice.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {notice.is_active ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        
                        {notice.original_filename && (
                          <button
                            onClick={() => handleDownload(notice)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="Download Attachment"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDelete(notice)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Notice"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.hasPrev}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FiChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalMode === 'create' && 'Create New Notice'}
                  {modalMode === 'edit' && 'Edit Notice'}
                  {modalMode === 'view' && 'Notice Details'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {modalMode === 'view' && selectedNotice ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedNotice.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        Created: {NoticeService.formatDate(selectedNotice.created_at)}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedNotice.is_active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedNotice.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {selectedNotice.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedNotice.description}
                      </p>
                    </div>
                  )}

                  {selectedNotice.original_filename && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Attachment</h4>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(selectedNotice.original_filename)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedNotice.original_filename}
                            </p>
                            <p className="text-xs text-gray-600">
                              {selectedNotice.file_type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownload(selectedNotice)}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          <FiDownload className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Last updated: {NoticeService.formatDate(selectedNotice.updated_at)}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter notice title"
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      placeholder="Enter notice description (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept=".pdf,.doc,.docx,image/*"
                    />
                    {formErrors.file && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <FiAlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.file}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, Images (max 10MB)
                    </p>
                    {formData.file && (
                      <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                        <FiCheck className="w-4 h-4 text-green-600" />
                        <span>Selected: {formData.file.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {submitting ? (
                        <>
                          <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                          {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                        </>
                      ) : (
                        modalMode === 'create' ? 'Create Notice' : 'Update Notice'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeManagement;