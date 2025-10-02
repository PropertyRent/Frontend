import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const meetingAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
meetingAPI.interceptors.response.use(
  (response) => {
    return {
      success: true,
      data: response.data
    };
  },
  (error) => {
    console.error('Schedule Meeting API Error:', error);
    
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

class ScheduleMeetingService {
  /**
   * Schedule a meeting for property viewing (public endpoint - no auth required)
   * @param {Object} meetingData - Meeting request data
   * @param {string} meetingData.full_name - Full name
   * @param {string} meetingData.email - Email address
   * @param {string} meetingData.phone - Phone number
   * @param {string} meetingData.meeting_date - Meeting date (YYYY-MM-DD)
   * @param {string} meetingData.meeting_time - Meeting time (HH:MM)
   * @param {string} meetingData.property_id - Property ID
   * @param {string} meetingData.message - Optional message
   * @returns {Promise<Object>} Response with meeting details
   */
  static async scheduleMeeting(meetingData) {
    try {
      console.log('Scheduling meeting with data:', meetingData);
      
      const response = await meetingAPI.post('/meetings/schedule', meetingData);
      return response;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      throw error;
    }
  }

  /**
   * Get user's scheduled meetings (requires authentication)
   * @param {string} status - Optional status filter
   * @returns {Promise<Object>} Response with user meetings
   */
  static async getUserMeetings(status = null) {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await meetingAPI.get(`/user/meetings?${params}`, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error fetching user meetings:', error);
      throw error;
    }
  }

  /**
   * Cancel user's meeting (requires authentication)
   * @param {string} meetingId - Meeting ID to cancel
   * @returns {Promise<Object>} Response with cancellation confirmation
   */
  static async cancelMeeting(meetingId) {
    try {
      const response = await meetingAPI.put(`/user/meetings/${meetingId}/cancel`, {}, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      throw error;
    }
  }

  /**
   * Get meeting by ID (public endpoint)
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<Object>} Response with meeting details
   */
  static async getMeetingById(meetingId) {
    try {
      const response = await meetingAPI.get(`/meetings/${meetingId}`);
      return response;
    } catch (error) {
      console.error('Error fetching meeting details:', error);
      throw error;
    }
  }

  // Admin methods (require admin authentication)

  /**
   * Get all meetings for admin review (admin only)
   * @param {string} status - Optional status filter
   * @param {string} propertyId - Optional property ID filter
   * @returns {Promise<Object>} Response with all meetings
   */
  static async getAllMeetingsAdmin(status = null, propertyId = null) {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (propertyId) params.append('property_id', propertyId);
      
      const response = await meetingAPI.get(`/admin/meetings?${params}`, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error fetching meetings for admin:', error);
      throw error;
    }
  }

  /**
   * Reply to meeting request (admin only)
   * @param {string} meetingId - Meeting ID
   * @param {Object} replyData - Reply data
   * @param {string} replyData.message - Admin message
   * @param {string} replyData.action - Optional action (approved/rejected)
   * @returns {Promise<Object>} Response with reply confirmation
   */
  static async adminReplyToMeeting(meetingId, replyData) {
    try {
      const response = await meetingAPI.post(`/admin/meetings/${meetingId}/reply`, replyData, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error sending admin reply:', error);
      throw error;
    }
  }

  /**
   * Mark meeting as completed (admin only)
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<Object>} Response with completion confirmation
   */
  static async adminCompleteMeeting(meetingId) {
    try {
      const response = await meetingAPI.put(`/admin/meetings/${meetingId}/complete`, {}, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error completing meeting:', error);
      throw error;
    }
  }

  /**
   * Delete meeting (admin only)
   * @param {string} meetingId - Meeting ID
   * @returns {Promise<Object>} Response with deletion confirmation
   */
  static async adminDeleteMeeting(meetingId) {
    try {
      const response = await meetingAPI.delete(`/admin/meetings/${meetingId}`, {
        withCredentials: true
      });
      return response;
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  }

  /**
   * Validate meeting data before submission
   * @param {Object} meetingData - Meeting data to validate
   * @returns {Object} Validation result
   */
  static validateMeetingData(meetingData) {
    const errors = {};

    // Validate required fields
    if (!meetingData.full_name || meetingData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters long';
    }

    if (!meetingData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(meetingData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!meetingData.phone || meetingData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }

    if (!meetingData.meeting_date) {
      errors.meeting_date = 'Please select a meeting date';
    } else {
      const selectedDate = new Date(meetingData.meeting_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.meeting_date = 'Meeting date cannot be in the past';
      }
    }

    if (!meetingData.meeting_time) {
      errors.meeting_time = 'Please select a meeting time';
    }

    if (!meetingData.property_id) {
      errors.property_id = 'Property ID is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format meeting data for API submission
   * @param {Object} formData - Form data from user input
   * @returns {Object} Formatted meeting data
   */
  static formatMeetingData(formData) {
    return {
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      meeting_date: formData.meeting_date,
      meeting_time: formData.meeting_time,
      property_id: formData.property_id,
      message: formData.message ? formData.message.trim() : null
    };
  }

  /**
   * Get available time slots for a given date
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Array} Array of available time slots
   */
  static getAvailableTimeSlots(date = null) {
    // Generate time slots from 9 AM to 6 PM
    const timeSlots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        timeSlots.push({
          value: timeString,
          display: displayTime,
          available: true // In a real app, you'd check availability against booked slots
        });
      }
    }
    
    return timeSlots;
  }

  /**
   * Check if a date is available for scheduling
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {boolean} Whether the date is available
   */
  static isDateAvailable(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow past dates
    if (selectedDate < today) {
      return false;
    }
    
    // Don't allow Sundays (day 0) for this example
    if (selectedDate.getDay() === 0) {
      return false;
    }
    
    return true;
  }
}

export default ScheduleMeetingService;