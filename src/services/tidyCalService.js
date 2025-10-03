import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:8001/api';

class TidyCalService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('TidyCal API Error:', error);
        
        if (error.response?.status === 401) {
          toast.error('Authentication required');
        } else if (error.response?.status === 403) {
          toast.error('Access denied');
        } else if (error.response?.status === 404) {
          toast.error('Resource not found');
        } else if (error.response?.status >= 500) {
          toast.error('Server error occurred');
        }
        
        return Promise.reject(error);
      }
    );
  }

  // === ADMIN ENDPOINTS ===

  /**
   * Create a TidyCal booking page for a property
   * @param {string} propertyId - Property ID
   * @param {Object} bookingPageData - Booking page configuration
   */
  async createBookingPage(propertyId, bookingPageData) {
    try {
      const response = await this.axiosInstance.post(
        `/admin/tidycal/booking-pages?property_id=${propertyId}`,
        bookingPageData
      );
      
      if (response.data.success) {
        toast.success('Booking page created successfully');
        return { success: true, data: response.data.data };
      } else {
        toast.error('Failed to create booking page');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to create booking page';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Get all TidyCal booking pages
   * @param {string} propertyId - Optional property ID filter
   */
  async getAllBookingPages(propertyId = null) {
    try {
      const url = propertyId 
        ? `/admin/tidycal/booking-pages?property_id=${propertyId}`
        : '/admin/tidycal/booking-pages';
      
      const response = await this.axiosInstance.get(url);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        console.error('Failed to fetch booking pages:', response.data.message);
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to fetch booking pages';
      console.error('Error fetching booking pages:', errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Get embed code for a booking page
   * @param {string} bookingPageId - Booking page ID
   * @param {string} width - Iframe width
   * @param {string} height - Iframe height
   */
  async getBookingPageEmbed(bookingPageId, width = '100%', height = '600px') {
    try {
      const response = await this.axiosInstance.get(
        `/admin/tidycal/booking-pages/${bookingPageId}/embed?width=${width}&height=${height}`
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        toast.error('Failed to get embed code');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to get embed code';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Update booking page
   * @param {string} bookingPageId - Booking page ID
   * @param {Object} updateData - Update data
   */
  async updateBookingPage(bookingPageId, updateData) {
    try {
      const response = await this.axiosInstance.put(
        `/admin/tidycal/booking-pages/${bookingPageId}`,
        updateData
      );
      
      if (response.data.success) {
        toast.success('Booking page updated successfully');
        return { success: true, data: response.data.data };
      } else {
        toast.error('Failed to update booking page');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to update booking page';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Delete booking page
   * @param {string} bookingPageId - Booking page ID
   */
  async deleteBookingPage(bookingPageId) {
    try {
      const response = await this.axiosInstance.delete(
        `/admin/tidycal/booking-pages/${bookingPageId}`
      );
      
      if (response.data.success) {
        toast.success('Booking page deleted successfully');
        return { success: true };
      } else {
        toast.error('Failed to delete booking page');
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to delete booking page';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Get TidyCal integration status
   */
  async getIntegrationStatus() {
    try {
      const response = await this.axiosInstance.get('/admin/tidycal/status');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to get integration status';
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Get booking analytics
   * @param {string} bookingPageId - Optional booking page ID filter
   */
  async getBookingAnalytics(bookingPageId = null) {
    try {
      const url = bookingPageId 
        ? `/admin/tidycal/analytics?booking_page_id=${bookingPageId}`
        : '/admin/tidycal/analytics';
      
      const response = await this.axiosInstance.get(url);
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to get booking analytics';
      return { success: false, error: errorMsg };
    }
  }

  // === PUBLIC ENDPOINTS ===

  /**
   * Get property booking embed code
   * @param {string} propertyId - Property ID
   * @param {string} width - Iframe width
   * @param {string} height - Iframe height
   */
  async getPropertyBookingEmbed(propertyId, width = '100%', height = '600px') {
    try {
      const response = await this.axiosInstance.get(
        `/tidycal/booking-pages/${propertyId}/embed?width=${width}&height=${height}`
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Booking not available for this property';
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Get property booking URL  
   * @param {string} propertyId - Property ID
   */
  async getPropertyBookingUrl(propertyId) {
    try {
      const response = await this.axiosInstance.get(
        `/tidycal/properties/${propertyId}/booking-url`
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Booking not available for this property';
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Check property booking availability
   * @param {string} propertyId - Property ID
   */
  async checkPropertyBookingAvailability(propertyId) {
    try {
      const response = await this.axiosInstance.get(
        `/tidycal/properties/${propertyId}/booking-status`
      );
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to check booking availability';
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Get integration guide
   */
  async getIntegrationGuide() {
    try {
      const response = await this.axiosInstance.get('/tidycal/integration-guide');
      
      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to get integration guide';
      return { success: false, error: errorMsg };
    }
  }

  // === UTILITY METHODS ===

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   */
  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }

  /**
   * Format booking status for display
   * @param {string} status - Booking status
   */
  static formatBookingStatus(status) {
    const statusMap = {
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      no_show: 'No Show',
      active: 'Active',
      inactive: 'Inactive',
      draft: 'Draft'
    };
    
    return statusMap[status] || status;
  }

  /**
   * Get status color class
   * @param {string} status - Status
   */
  static getStatusColorClass(status) {
    const colorMap = {
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Validate booking page data
   * @param {Object} data - Booking page data
   */
  static validateBookingPageData(data) {
    const errors = {};
    
    if (!data.page_name || data.page_name.trim().length === 0) {
      errors.page_name = 'Page name is required';
    }
    
    if (data.duration_minutes && (data.duration_minutes < 15 || data.duration_minutes > 480)) {
      errors.duration_minutes = 'Duration must be between 15 and 480 minutes';
    }
    
    if (data.buffer_before && (data.buffer_before < 0 || data.buffer_before > 120)) {
      errors.buffer_before = 'Buffer before must be between 0 and 120 minutes';
    }
    
    if (data.buffer_after && (data.buffer_after < 0 || data.buffer_after > 120)) {
      errors.buffer_after = 'Buffer after must be between 0 and 120 minutes';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Generate property booking redirect URL
   * @param {string} propertyId - Property ID
   */
  static getPropertyBookingRedirectUrl(propertyId) {
    return `/tidycal/properties/${propertyId}/book-viewing`;
  }
}

// Create singleton instance
const tidyCalService = new TidyCalService();

// Export both the instance and the class for static methods
export { TidyCalService };
export default tidyCalService;