import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const teamAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
teamAPI.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('Team API Error:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.detail || 
                          error.response.data?.message || 
                          `Request failed with status ${error.response.status}`;
      
      return Promise.reject({
        success: false,
        message: errorMessage,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection and try again.',
        status: 0
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || 'An unexpected error occurred',
        status: -1
      });
    }
  }
);

class TeamService {
  /**
   * Get all team members (public endpoint)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items per page
   * @param {number} params.offset - Number of items to skip
   * @param {string} params.position - Filter by position
   * @param {string} params.search - Search by name or email
   * @returns {Promise<Object>} Response with team members and pagination info
   */
  static async getAllTeamMembers({ limit = 10, offset = 0, position = null, search = null } = {}) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });
      
      if (position) params.append('position', position);
      if (search) params.append('search', search);
      
      const response = await teamAPI.get(`/public/team?${params}`);
      return response;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  /**
   * Get team member by ID (public endpoint)
   * @param {string} memberId - Team member ID
   * @returns {Promise<Object>} Team member details
   */
  static async getTeamMemberById(memberId) {
    try {
      const response = await teamAPI.get(`/public/team/${memberId}`);
      return response;
    } catch (error) {
      console.error('Error fetching team member details:', error);
      throw error;
    }
  }

  // Admin methods (require authentication)

  /**
   * Create team member with photo upload
   * @param {FormData} formData - Form data with team member details and optional photo
   * @returns {Promise<Object>} Created team member
   */
  static async createTeamMember(formData) {
    try {
      const response = await teamAPI.post('/admin/team/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  }

  /**
   * Update team member with optional photo upload
   * @param {string} memberId - Team member ID
   * @param {FormData} formData - Form data with updated team member details and optional photo
   * @returns {Promise<Object>} Updated team member
   */
  static async updateTeamMember(memberId, formData) {
    try {
      const response = await teamAPI.put(`/admin/team/${memberId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  /**
   * Delete team member
   * @param {string} memberId - Team member ID
   * @returns {Promise<Object>} Confirmation response
   */
  static async deleteTeamMember(memberId) {
    try {
      const response = await teamAPI.delete(`/admin/team/${memberId}`, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }

  /**
   * Get team statistics for dashboard
   * @returns {Promise<Object>} Team statistics
   */
  static async getTeamStats() {
    try {
      const response = await this.getAllTeamMembers({ limit: 100, offset: 0 });
      
      if (response.success && response.data) {
        const teamMembers = response.data.team_members;
        const positions = {};
        
        teamMembers.forEach(member => {
          const position = member.position_name;
          positions[position] = (positions[position] || 0) + 1;
        });

        return {
          success: true,
          data: {
            total: response.data.pagination.total,
            positions: positions,
            recent_members: teamMembers.slice(-5).reverse() // Last 5 members, newest first
          }
        };
      }
      
      return { success: false, message: 'Failed to fetch team statistics' };
    } catch (error) {
      console.error('Error fetching team stats:', error);
      throw error;
    }
  }

  /**
   * Helper method to create FormData from team member data
   * @param {Object} teamData - Team member data
   * @param {File} photoFile - Optional photo file
   * @returns {FormData} Formatted form data
   */
  static createFormData(teamData, photoFile = null) {
    const formData = new FormData();
    
    // Add required fields
    if (teamData.name) formData.append('name', teamData.name);
    if (teamData.age) formData.append('age', teamData.age.toString());
    if (teamData.email) formData.append('email', teamData.email);
    if (teamData.position_name) formData.append('position_name', teamData.position_name);
    
    // Add optional fields
    if (teamData.description) formData.append('description', teamData.description);
    if (teamData.phone) formData.append('phone', teamData.phone);
    
    // Add photo if provided
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    
    return formData;
  }
}

export default TeamService;