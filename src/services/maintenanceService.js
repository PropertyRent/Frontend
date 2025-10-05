import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_APP_URL;

class MaintenanceService {
  // Get all maintenance requests with filtering and pagination
  static async getAllRequests({ limit = 20, offset = 0, search, status, priority } = {}) {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);

      const response = await axios.get(`${apiUrl}/api/admin/maintenance-requests?${params.toString()}`, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to fetch maintenance requests';
      return {
        success: false,
        message: errorMessage,
        data: { requests: [], pagination: { total: 0, limit, offset, has_next: false, has_prev: false } }
      };
    }
  }

  // Get single maintenance request by ID
  static async getRequestById(requestId) {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/maintenance-requests/${requestId}`, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching maintenance request:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to fetch maintenance request details';
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Create new maintenance request with photos
  static async createRequest(formData, photoFiles = []) {
    try {
      // Create FormData for multipart/form-data
      const data = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      // Add photo files
      if (photoFiles && photoFiles.length > 0) {
        photoFiles.forEach((file, index) => {
          data.append('photos', file);
        });
      }

      const response = await axios.post(`${apiUrl}/api/admin/maintenance-requests`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to create maintenance request';
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Update maintenance request
  static async updateRequest(requestId, formData) {
    try {
      // Filter out empty values
      const cleanedData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
          cleanedData[key] = formData[key];
        }
      });

      const response = await axios.put(`${apiUrl}/api/admin/maintenance-requests/${requestId}`, cleanedData, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update maintenance request';
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Send maintenance request to contractor
  static async sendToContractor(requestId, sendData) {
    try {
      const response = await axios.post(`${apiUrl}/api/admin/maintenance-requests/${requestId}/send-to-contractor`, sendData, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error sending to contractor:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to send maintenance request to contractor';
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Delete maintenance request
  static async deleteRequest(requestId) {
    try {
      const response = await axios.delete(`${apiUrl}/api/admin/maintenance-requests/${requestId}`, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to delete maintenance request';
      return {
        success: false,
        message: errorMessage,
        data: null
      };
    }
  }

  // Get requests by status
  static async getRequestsByStatus(status) {
    try {
      const response = await axios.get(`${apiUrl}/api/admin/maintenance-requests/status/${status}`, {
        withCredentials: true
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching requests by status:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to fetch maintenance requests by status';
      return {
        success: false,
        message: errorMessage,
        data: { requests: [], count: 0, status }
      };
    }
  }

  // Helper function to format dates consistently
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
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }

  // Helper function to get priority display name and color
  static getPriorityInfo(priority) {
    const priorityMap = {
      low: { label: 'Low', color: '#10B981', bgColor: '#D1FAE5' },
      medium: { label: 'Medium', color: '#F59E0B', bgColor: '#FEF3C7' },
      high: { label: 'High', color: '#F97316', bgColor: '#FED7AA' },
      urgent: { label: 'Urgent', color: '#EF4444', bgColor: '#FEE2E2' }
    };
    
    return priorityMap[priority] || { label: priority, color: '#6B7280', bgColor: '#F3F4F6' };
  }

  // Helper function to get status display name and color
  static getStatusInfo(status) {
    const statusMap = {
      pending: { label: 'Pending', color: '#F59E0B', bgColor: '#FEF3C7' },
      sent_to_contractor: { label: 'Sent to Contractor', color: '#3B82F6', bgColor: '#DBEAFE' },
      in_progress: { label: 'In Progress', color: '#8B5CF6', bgColor: '#EDE9FE' },
      completed: { label: 'Completed', color: '#10B981', bgColor: '#D1FAE5' },
      cancelled: { label: 'Cancelled', color: '#EF4444', bgColor: '#FEE2E2' }
    };
    
    return statusMap[status] || { label: status, color: '#6B7280', bgColor: '#F3F4F6' };
  }

  // Helper function to validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Helper function to validate phone format (basic validation)
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // Helper function to format currency
  static formatCurrency(amount) {
    if (!amount || isNaN(amount)) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  }

  // Helper function to generate summary statistics
  static generateStats(requests) {
    const stats = {
      total: requests.length,
      pending: 0,
      sent_to_contractor: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      priority_breakdown: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      },
      estimated_total_cost: 0
    };

    requests.forEach(request => {
      // Count by status
      if (stats.hasOwnProperty(request.status)) {
        stats[request.status]++;
      }

      // Count by priority
      if (stats.priority_breakdown.hasOwnProperty(request.priority)) {
        stats.priority_breakdown[request.priority]++;
      }

      // Sum estimated costs
      if (request.estimated_cost) {
        stats.estimated_total_cost += parseFloat(request.estimated_cost);
      }
    });

    return stats;
  }
}

export default MaintenanceService;