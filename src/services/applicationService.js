import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

class ApplicationService {
  // === PUBLIC METHODS ===

  /**
   * Submit rental application (no auth required)
   */
  static async submitApplication(applicationData) {
    try {
      const response = await api.post('/applications/submit', applicationData);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to submit application',
        data: null
      };
    }
  }

  // === ADMIN METHODS ===

  /**
   * Get all applications (admin only)
   */
  static async getAllApplications(params = {}) {
    try {
      const { status, search } = params;
      
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (search) queryParams.append('search', search);

      const response = await api.get(`/admin/applications?${queryParams}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to fetch applications',
        data: null
      };
    }
  }

  /**
   * Get application by ID (admin only)
   */
  static async getApplicationById(applicationId) {
    try {
      const response = await api.get(`/admin/applications/${applicationId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch application');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to fetch application',
        data: null
      };
    }
  }

  /**
   * Admin reply to application
   */
  static async replyToApplication(applicationId, replyData) {
    try {
      const response = await api.post(`/admin/applications/${applicationId}/reply`, replyData);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to send reply',
        data: null
      };
    }
  }

  /**
   * Update application status
   */
  static async updateApplicationStatus(applicationId, status) {
    try {
      const endpoint = `/admin/applications/${applicationId}/status/${status}`;
      const response = await api.put(endpoint);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to update status',
        data: null
      };
    }
  }

  /**
   * Delete application (admin only)
   */
  static async deleteApplication(applicationId) {
    try {
      const response = await api.delete(`/admin/applications/${applicationId}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to delete application'
      };
    }
  }

  // === UTILITY METHODS ===

  /**
   * Format application date for display
   */
  static formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Format application status for display
   */
  static formatStatus(status) {
    const statusMap = {
      'pending': 'Pending Review',
      'reviewed': 'Under Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'completed': 'Completed'
    };
    return statusMap[status] || status;
  }

  /**
   * Get status color for UI
   */
  static getStatusColor(status) {
    const colorMap = {
      'pending': 'text-yellow-600 bg-yellow-100',
      'reviewed': 'text-blue-600 bg-blue-100',
      'approved': 'text-green-600 bg-green-100',
      'rejected': 'text-red-600 bg-red-100',
      'completed': 'text-purple-600 bg-purple-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  }

  /**
   * Validate application data before submission
   */
  static validateApplicationData(applicationData) {
    const errors = {};
    
    // Validate personal information
    if (applicationData.personal_information) {
      const personal = applicationData.personal_information;
      if (!personal.full_name?.trim()) {
        errors.full_name = 'Full name is required';
      }
      if (!personal.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!personal.phone_number?.trim()) {
        errors.phone_number = 'Phone number is required';
      }
    }

    // Validate employment information if provided
    if (applicationData.employment_income?.current_employer) {
      const employer = applicationData.employment_income.current_employer;
      if (employer.monthly_income && employer.monthly_income < 0) {
        errors.monthly_income = 'Monthly income must be a positive number';
      }
    }

    // Validate signature acknowledgment
    if (applicationData.signature_acknowledgment?.terms_acknowledgment) {
      const terms = applicationData.signature_acknowledgment.terms_acknowledgment;
      if (!terms.agree_to_lease_terms) {
        errors.agree_to_lease_terms = 'You must agree to the lease terms';
      }
      if (!terms.consent_to_background_credit_checks) {
        errors.consent_to_background_credit_checks = 'Background check consent is required';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Create empty application structure for form initialization
   */
  static createEmptyApplication(propertyId = null) {
    return {
      property_id: propertyId,
      personal_information: {
        full_name: '',
        email: '',
        phone_number: '',
        date_of_birth: null,
        social_security_number: '',
        drivers_license_number: '',
        emergency_contact: {
          name: '',
          relationship: '',
          phone_number: ''
        }
      },
      residential_history: {
        current_address: {
          street_address: '',
          city: '',
          state: '',
          zip: '',
          move_in_date: null,
          monthly_rent: null,
          reason_for_leaving: ''
        },
        previous_address: {
          street_address: '',
          city: '',
          state: '',
          zip: '',
          move_in_date: null,
          move_out_date: null,
          monthly_rent: null,
          reason_for_leaving: ''
        },
        landlord_contact: {
          name: '',
          phone_number: '',
          email: ''
        }
      },
      employment_income: {
        current_employer: {
          company_name: '',
          job_title: '',
          supervisor_name: '',
          employment_start_date: null,
          monthly_income: null
        },
        additional_income_sources: [],
        bank_account_information: {
          bank_name: '',
          account_type: '',
          routing_number: '',
          account_number: ''
        }
      },
      credit_background_check: {
        consent: false,
        criminal_history: {
          ever_convicted_felony: false,
          details: ''
        },
        eviction_history: {
          ever_evicted: false,
          details: ''
        }
      },
      references: {
        personal_references: [],
        professional_references: []
      },
      additional_information: {
        pets: [],
        vehicles: [],
        additional_applicants: []
      },
      signature_acknowledgment: {
        electronic_signature: {
          full_name: '',
          signature_date: null
        },
        terms_acknowledgment: {
          agree_to_lease_terms: false,
          consent_to_background_credit_checks: false,
          understand_rental_policies: false
        }
      },
      lease_signing_payment: {
        lease_agreement: {
          reviewed: false,
          signed: false
        },
        security_deposit_payment: {
          amount_due: null,
          payment_method: ''
        },
        first_month_rent: {
          amount_due: null,
          payment_method: ''
        }
      }
    };
  }

  /**
   * Get section completion percentage
   */
  static getSectionCompletion(sectionData, sectionType) {
    if (!sectionData) return 0;

    let totalFields = 0;
    let filledFields = 0;

    const countFields = (obj, requiredFields = []) => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          countFields(value);
        } else if (typeof value !== 'object') {
          totalFields++;
          if (value !== null && value !== '' && value !== false) {
            filledFields++;
          }
        }
      }
    };

    countFields(sectionData);
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  }
}

export default ApplicationService;