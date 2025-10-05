import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiUsers,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch, 
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiX,
  FiSave,
  FiUpload,
  FiEye
} from 'react-icons/fi';
import TeamService from '../../services/teamService';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ConfirmationModal';

const TeamManagement = () => {
  // State management
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'create', 'edit'
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    position_name: '',
    description: '',
    phone: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    position: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    has_next: false,
    has_prev: false
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    memberId: null,
    memberName: '',
    isLoading: false
  });

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    positions: {}
  });

  // Load team members on component mount and when filters/pagination change
  useEffect(() => {
    loadTeamMembers();
  }, [filters, pagination.offset]);

  // Load team statistics
  useEffect(() => {
    loadStats();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await TeamService.getAllTeamMembers({
        limit: pagination.limit,
        offset: pagination.offset,
        position: filters.position || null,
        search: filters.search || null
      });

      if (response.success) {
        setTeamMembers(response.data.team_members);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          has_next: response.data.pagination.has_next,
          has_prev: response.data.pagination.has_prev
        }));
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await TeamService.getTeamStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreate = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      age: member.age.toString(),
      email: member.email,
      position_name: member.position_name,
      description: member.description || '',
      phone: member.phone || ''
    });
    setPhotoPreview(member.photo ? member.photo : null);
    setSelectedMember(member);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteClick = (member) => {
    setConfirmModal({
      isOpen: true,
      memberId: member.id,
      memberName: member.name,
      isLoading: false
    });
  };

  const handleConfirmDelete = async () => {
    setConfirmModal(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await TeamService.deleteTeamMember(confirmModal.memberId);
      if (response.success) {
        toast.success('Team member deleted successfully');
        loadTeamMembers();
        loadStats();
        setConfirmModal({ isOpen: false, memberId: null, memberName: '', isLoading: false });
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
      setConfirmModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseModal = () => {
    if (!confirmModal.isLoading) {
      setConfirmModal({ isOpen: false, memberId: null, memberName: '', isLoading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.email || !formData.position_name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setFormLoading(true);
    try {
      const formDataToSend = TeamService.createFormData({
        ...formData,
        age: parseInt(formData.age)
      }, photoFile);

      let response;
      if (modalMode === 'create') {
        response = await TeamService.createTeamMember(formDataToSend);
      } else {
        response = await TeamService.updateTeamMember(selectedMember.id, formDataToSend);
      }

      if (response.success) {
        toast.success(modalMode === 'create' ? 'Team member created successfully' : 'Team member updated successfully');
        setShowModal(false);
        loadTeamMembers();
        loadStats();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(`Failed to ${modalMode === 'create' ? 'create' : 'update'} team member`);
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      email: '',
      position_name: '',
      description: '',
      phone: ''
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setSelectedMember(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Photo must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePageChange = (newOffset) => {
    setPagination(prev => ({ ...prev, offset: newOffset }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <p className="text-gray-600">Manage team members and their information</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUser className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Positions</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.positions).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiPlus className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Additions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recent_members?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
                value={filters.position}
                onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Positions</option>
                {Object.keys(stats.positions).map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <button
              onClick={loadTeamMembers}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-600">
            Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="p-8 text-center">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No team members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.photo ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={member.photo}
                              alt={member.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <FiUser className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">Age: {member.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {member.position_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1 mb-1">
                        <FiMail className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-40">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-1">
                          <FiPhone className="w-3 h-3 text-gray-400" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(member)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                          title="Edit Member"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(member)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Member"
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

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'view' ? 'Team Member Details' : 
                   modalMode === 'create' ? 'Add Team Member' : 'Edit Team Member'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {modalMode === 'view' ? (
                // View Mode
                <div className="space-y-6">
                  <div className="text-center">
                    {selectedMember?.photo ? (
                      <img
                        className="h-24 w-24 rounded-full object-cover mx-auto mb-4"
                        src={selectedMember.photo}
                        alt={selectedMember.name}
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <FiUser className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <h4 className="text-xl font-semibold text-gray-900">{selectedMember?.name}</h4>
                    <p className="text-blue-600 font-medium">{selectedMember?.position_name}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedMember?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <p className="text-gray-900">{selectedMember?.age}</p>
                    </div>
                    {selectedMember?.phone && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-gray-900">{selectedMember.phone}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Joined</label>
                      <p className="text-gray-900">{formatDate(selectedMember?.created_at)}</p>
                    </div>
                  </div>

                  {selectedMember?.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <p className="text-gray-900">{selectedMember.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                // Create/Edit Mode
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Photo Upload */}
                  <div className="text-center">
                    <div className="mb-4">
                      {photoPreview ? (
                        <img
                          className="h-24 w-24 rounded-full object-cover mx-auto"
                          src={photoPreview}
                          alt="Preview"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                          <FiUser className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <FiUpload className="w-4 h-4" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="18"
                        max="100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.position_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, position_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                      placeholder="Brief description or bio..."
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FiSave className="w-4 h-4" />
                      )}
                      {formLoading ? 'Saving...' : (modalMode === 'create' ? 'Create Member' : 'Update Member')}
                    </button>
                  </div>
                </form>
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
        title="Delete Team Member"
        message={`Are you sure you want to delete "${confirmModal.memberName}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
};

export default TeamManagement;