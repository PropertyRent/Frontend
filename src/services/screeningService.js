import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ScreeningService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ============ PUBLIC METHODS ============

  /**
   * Get active screening questions for public form
   */
  async getActiveQuestions() {
    try {
      const response = await this.api.get('/public/screening/questions');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to fetch screening questions',
        error: error.response?.data
      };
    }
  }

  /**
   * Submit screening response (public)
   */
  async submitResponse(responseData) {
    try {
      const response = await this.api.post('/public/screening/responses', responseData);
      return {
        success: true,
        data: response.data,
        message: 'Screening response submitted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to submit screening response',
        error: error.response?.data
      };
    }
  }

  // ============ ADMIN METHODS ============

  /**
   * Get all screening responses (admin)
   */
  async getAllResponses({ limit = 20, offset = 0, search = '' } = {}) {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await this.api.get(`/admin/screening/responses?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to fetch screening responses',
        error: error.response?.data
      };
    }
  }

  /**
   * Get detailed screening response (admin)
   */
  async getResponseById(responseId) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await this.api.get(`/admin/screening/responses/${responseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to fetch screening response details',
        error: error.response?.data
      };
    }
  }

  /**
   * Reply to screening response (admin)
   */
  async replyToResponse(responseId, replyData) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await this.api.put(`/admin/screening/responses/${responseId}/reply`, replyData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        success: true,
        data: response.data,
        message: 'Reply sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to send reply',
        error: error.response?.data
      };
    }
  }

  /**
   * Delete screening response (admin)
   */
  async deleteResponse(responseId) {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await this.api.delete(`/admin/screening/responses/${responseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        success: true,
        data: response.data,
        message: 'Response deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to delete response',
        error: error.response?.data
      };
    }
  }

  /**
   * Bulk create screening questions (admin)
   */
  async bulkCreateQuestions(questionsData) {
    try {
      const response = await this.api.post('/admin/screening/questions/bulk', questionsData, {
        withCredentials: true,
      });
      console.log('Bulk create response:', response);

      return {
        success: true,
        data: response.data,
        message: 'Questions created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to create questions',
        error: error.response?.data
      };
    }
  }

  /**
   * Delete screening question (admin)
   */
  async deleteQuestion(questionId) {
    try {
      const response = await this.api.delete(`/admin/screening/questions/${questionId}`, {
        withCredentials: true,
      });

      return {
        success: true,
        data: response.data,
        message: 'Question deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to delete question',
        error: error.response?.data
      };
    }
  }

  // ============ UTILITY METHODS ============

  /**
   * Format date for display
   */
  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
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

  /**
   * Format answer value based on question type
   */
  static formatAnswerValue(answer) {
    if (answer.answer_value === null || answer.answer_value === undefined) {
      return 'No answer';
    }

    switch (answer.question_type) {
      case 'text':
        return answer.answer_text || 'No answer';
      case 'number':
        return answer.answer_number?.toString() || 'No answer';
      case 'date':
        return answer.answer_date ? new Date(answer.answer_date).toLocaleDateString() : 'No answer';
      case 'yesno':
        return answer.answer_yesno === true ? 'Yes' : answer.answer_yesno === false ? 'No' : 'No answer';
      default:
        return 'No answer';
    }
  }

  /**
   * Validate screening response data
   */
  static validateResponseData(responseData) {
    const errors = {};

    // Validate basic info
    if (!responseData.full_name || responseData.full_name.trim().length < 2) {
      errors.full_name = 'Full name is required (minimum 2 characters)';
    }

    if (!responseData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(responseData.email)) {
      errors.email = 'Valid email address is required';
    }

    if (!responseData.phone || responseData.phone.trim().length < 10) {
      errors.phone = 'Valid phone number is required (minimum 10 characters)';
    }

    // Validate answers
    if (!responseData.answers || responseData.answers.length === 0) {
      errors.answers = 'At least one answer is required';
    } else {
      responseData.answers.forEach((answer, index) => {
        if (!answer.question_id) {
          errors[`answer_${index}_question_id`] = 'Question ID is required';
        }

        // Check if at least one answer field is provided
        const hasAnswer = answer.answer_text || 
                          answer.answer_number !== null && answer.answer_number !== undefined ||
                          answer.answer_date ||
                          answer.answer_yesno !== null && answer.answer_yesno !== undefined;

        if (!hasAnswer) {
          errors[`answer_${index}_value`] = 'Answer value is required';
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Create empty response object
   */
  static createEmptyResponse() {
    return {
      full_name: '',
      email: '',
      phone: '',
      message: '',
      answers: []
    };
  }

  /**
   * Create answer object for a question
   */
  static createAnswerForQuestion(question, value) {
    const answer = {
      question_id: question.id,
      answer_text: null,
      answer_number: null,
      answer_date: null,
      answer_yesno: null
    };

    switch (question.question_type) {
      case 'text':
        answer.answer_text = value;
        break;
      case 'number':
        answer.answer_number = parseInt(value) || null;
        break;
      case 'date':
        answer.answer_date = value;
        break;
      case 'yesno':
        answer.answer_yesno = value === true || value === 'true' || value === 'yes';
        break;
    }

    return answer;
  }
}

// Export both the class and an instance
const screeningServiceInstance = new ScreeningService();

// Add static methods to the instance for backward compatibility
screeningServiceInstance.formatDate = ScreeningService.formatDate;
screeningServiceInstance.formatAnswerValue = ScreeningService.formatAnswerValue;
screeningServiceInstance.validateResponseData = ScreeningService.validateResponseData;
screeningServiceInstance.createEmptyResponse = ScreeningService.createEmptyResponse;
screeningServiceInstance.createAnswerForQuestion = ScreeningService.createAnswerForQuestion;

export default screeningServiceInstance;