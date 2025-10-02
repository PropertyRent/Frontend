import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const contactAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth tokens
// contactAPI.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for error handling
contactAPI.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('Contact API Error:', error);
    
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

class ContactService {
  /**
   * Submit contact form (public endpoint)
   * @param {Object} contactData - Contact form data
   * @param {string} contactData.full_name - User's full name
   * @param {string} contactData.email - User's email
   * @param {string} contactData.message - User's message
   * @returns {Promise<Object>} Response with success confirmation
   */
  static async submitContact(contactData) {
    try {
      const response = await contactAPI.post('/public/contact', contactData);
      console.log('Contact submitted:', response);
      return response;
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  }

  // Admin methods (require authentication)

  /**
   * Get all contact messages with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of items per page
   * @param {number} params.offset - Number of items to skip
   * @param {string} params.status - Filter by status (pending, replied, resolved)
   * @param {string} params.search - Search by name or email
   * @returns {Promise<Object>} Response with contacts and pagination info
   */
  static async getAllContacts({ limit = 20, offset = 0, status = null, search = null } = {}) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });
      
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      
      const response = await contactAPI.get(`/admin/contacts?${params}`, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  /**
   * Get contact message by ID
   * @param {string} contactId - Contact message ID
   * @returns {Promise<Object>} Contact details
   */
  static async getContactById(contactId) {
    try {
      const response = await contactAPI.get(`/admin/contacts/${contactId}`, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error fetching contact details:', error);
      throw error;
    }
  }

  /**
   * Reply to contact message
   * @param {string} contactId - Contact message ID
   * @param {string} message - Admin reply message
   * @returns {Promise<Object>} Updated contact with reply
   */
  static async replyToContact(contactId, message) {
    try {
      const response = await contactAPI.post(`/admin/contacts/${contactId}/reply`, {
        message: message
      }, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error sending reply:', error);
      throw error;
    }
  }

  /**
   * Update contact status
   * @param {string} contactId - Contact message ID
   * @param {string} status - New status (pending, replied, resolved)
   * @param {string} adminReply - Optional admin reply
   * @returns {Promise<Object>} Updated contact
   */
  static async updateContactStatus(contactId, status, adminReply = null) {
    try {
      const updateData = { status };
      if (adminReply) {
        updateData.admin_reply = adminReply;
      }

      const response = await contactAPI.put(`/admin/contacts/${contactId}/status`, updateData, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  }

  /**
   * Delete contact message
   * @param {string} contactId - Contact message ID
   * @returns {Promise<Object>} Confirmation response
   */
  static async deleteContact(contactId) {
    try {
      const response = await contactAPI.delete(`/admin/contacts/${contactId}`, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  /**
   * Get contact statistics for dashboard
   * @returns {Promise<Object>} Contact statistics
   */
  static async getContactStats() {
    try {
      // Get counts for each status
      const [pending, replied, resolved] = await Promise.all([
        this.getAllContacts({ limit: 1, status: 'pending' }),
        this.getAllContacts({ limit: 1, status: 'replied' }),
        this.getAllContacts({ limit: 1, status: 'resolved' })
      ]);

      return {
        success: true,
        data: {
          pending: pending.data.pagination.total,
          replied: replied.data.pagination.total,
          resolved: resolved.data.pagination.total,
          total: pending.data.pagination.total + replied.data.pagination.total + resolved.data.pagination.total
        }
      };
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      throw error;
    }
  }
}

export default ContactService;