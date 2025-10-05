import { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSearch, 
  FiEye,
  FiMail,
  FiPhone,
  FiUser,
  FiHome,
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiSend
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import ApplicationService from '../../services/applicationService';
import ConfirmationModal from '../ConfirmationModal';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'reply'
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0
  });

  // Reply form state
  const [replyForm, setReplyForm] = useState({
    reply: '',
    status: ''
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    applicationId: null,
    applicantName: '',
    isLoading: false
  });

  useEffect(() => {
    fetchApplications();
  }, [searchTerm, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await ApplicationService.getAllApplications({
        status: statusFilter || undefined,
        search: searchTerm || undefined
      });

      if (response.success) {
        setApplications(response.data.applications);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
        
        // Calculate statistics
        const newStats = {
          total: response.data.total,
          pending: response.data.applications.filter(app => app.status === 'pending').length,
          reviewed: response.data.applications.filter(app => app.status === 'reviewed').length,
          approved: response.data.applications.filter(app => app.status === 'approved').length,
          rejected: response.data.applications.filter(app => app.status === 'rejected').length,
          completed: response.data.applications.filter(app => app.status === 'completed').length,
        };
        setStats(newStats);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = async (application) => {
    try {
      const response = await ApplicationService.getApplicationById(application.id);
      if (response.success) {
        setSelectedApplication(response.data);
        setModalMode('view');
        setShowModal(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to fetch application details');
    }
  };

  const handleReplyToApplication = (application) => {
    setSelectedApplication(application);
    setModalMode('reply');
    setReplyForm({ reply: '', status: application.status });
    setShowModal(true);
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const response = await ApplicationService.updateApplicationStatus(applicationId, status);
      if (response.success) {
        toast.success(response.message);
        fetchApplications();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleSubmitReply = async () => {
    if (!replyForm.reply.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ApplicationService.replyToApplication(selectedApplication.id, {
        reply: replyForm.reply,
        status: replyForm.status || undefined
      });

      if (response.success) {
        toast.success(response.message);
        setShowModal(false);
        setReplyForm({ reply: '', status: '' });
        fetchApplications();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (application) => {
    setConfirmModal({
      isOpen: true,
      applicationId: application.id,
      applicantName: application.personal_information?.full_name || 'Unknown Applicant',
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await ApplicationService.deleteApplication(confirmModal.applicationId);
      if (response.success) {
        toast.success(response.message);
        fetchApplications();
        setConfirmModal({ isOpen: false, applicationId: null, applicantName: '', isLoading: false });
      } else {
        toast.error(response.message);
        setConfirmModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!confirmModal.isLoading) {
      setConfirmModal({ isOpen: false, applicationId: null, applicantName: '', isLoading: false });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setReplyForm({ reply: '', status: '' });
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

  const StatusBadge = ({ status }) => {
    const colorClass = ApplicationService.getStatusColor(status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {ApplicationService.formatStatus(status)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage rental applications and communicate with applicants
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Applications" count={stats.total} color="#3B82F6" icon={FiFileText} />
        <StatCard title="Pending Review" count={stats.pending} color="#F59E0B" icon={FiLoader} />
        <StatCard title="Under Review" count={stats.reviewed} color="#06B6D4" icon={FiEye} />
        <StatCard title="Approved" count={stats.approved} color="#10B981" icon={FiCheck} />
        <StatCard title="Rejected" count={stats.rejected} color="#EF4444" icon={FiX} />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
        </div>
        
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">No applications match your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.full_name || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                            {application.email || 'No Email'}
                          </div>
                          {application.phone_number && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiPhone className="w-3 h-3 mr-1" />
                              {application.phone_number}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {application.property_basic_info ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.property_basic_info.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.property_basic_info.city}, {application.property_basic_info.state}
                          </div>
                          {application.property_basic_info.price && (
                            <div className="text-sm text-blue-600 font-medium">
                              ${application.property_basic_info.price.toLocaleString()}/mo
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No property info</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {ApplicationService.formatDate(application.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReplyToApplication(application)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Send Reply"
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'reviewed')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark as Reviewed
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'approved')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'completed')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark as Completed
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(application)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Application"
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
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'view' ? 'Application Details' : 'Send Reply'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {modalMode === 'view' ? (
                <div className="space-y-6">
                  {/* Personal Information */}
                  {selectedApplication.personal_information && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <FiUser className="w-5 h-5 mr-2" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Name:</strong> {selectedApplication.personal_information.full_name}</div>
                        <div><strong>Email:</strong> {selectedApplication.personal_information.email}</div>
                        <div><strong>Phone:</strong> {selectedApplication.personal_information.phone_number}</div>
                        {selectedApplication.personal_information.date_of_birth && (
                          <div><strong>Date of Birth:</strong> {ApplicationService.formatDate(selectedApplication.personal_information.date_of_birth)}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Employment Information */}
                  {selectedApplication.employment_income?.current_employer && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <FiBriefcase className="w-5 h-5 mr-2" />
                        Employment Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Company:</strong> {selectedApplication.employment_income.current_employer.company_name}</div>
                        <div><strong>Position:</strong> {selectedApplication.employment_income.current_employer.job_title}</div>
                        {selectedApplication.employment_income.current_employer.monthly_income && (
                          <div><strong>Monthly Income:</strong> ${selectedApplication.employment_income.current_employer.monthly_income.toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Property Information */}
                  {selectedApplication.property_details && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <FiHome className="w-5 h-5 mr-2" />
                        Property Information
                      </h3>
                      <div className="text-sm">
                        <div><strong>Title:</strong> {selectedApplication.property_details.title}</div>
                        <div><strong>Address:</strong> {selectedApplication.property_details.address}, {selectedApplication.property_details.city}, {selectedApplication.property_details.state}</div>
                        {selectedApplication.property_details.price && (
                          <div><strong>Rent:</strong> ${selectedApplication.property_details.price.toLocaleString()}/mo</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Reply */}
                  {selectedApplication.admin_reply && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Reply</h3>
                      <p className="text-sm text-blue-800 mb-2">{selectedApplication.admin_reply}</p>
                      {selectedApplication.admin_reply_date && (
                        <p className="text-xs text-blue-600">
                          Replied on: {ApplicationService.formatDate(selectedApplication.admin_reply_date)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reply Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={replyForm.reply}
                      onChange={(e) => setReplyForm(prev => ({ ...prev, reply: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your reply to the applicant..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status (Optional)
                    </label>
                    <select
                      value={replyForm.status}
                      onChange={(e) => setReplyForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Keep current status</option>
                      <option value="reviewed">Mark as Reviewed</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                      <option value="completed">Mark as Completed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {modalMode === 'reply' && (
                <button
                  onClick={handleSubmitReply}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 bg-blue-400 rounded animate-pulse"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      <span>Send Reply</span>
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
        title="Delete Application"
        message={`Are you sure you want to delete the application from "${confirmModal.applicantName}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={confirmModal.isLoading}
        type="danger"
      />
    </div>
  );
};

export default ApplicationManagement;