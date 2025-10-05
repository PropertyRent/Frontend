import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const chatbotAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add any auth tokens if needed
chatbotAPI.interceptors.request.use(
  (config) => {
    // Add auth token if available (for admin routes)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
chatbotAPI.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('Chatbot API Error:', error);
    
    if (error.response) {
      // Server responded with error status
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
      // Network error
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection and try again.',
        status: 0
      });
    } else {
      // Other error
      return Promise.reject({
        success: false,
        message: error.message || 'An unexpected error occurred',
        status: -1
      });
    }
  }
);

class ChatbotService {
  /**
   * Start a new chat conversation or resume existing one
   * @param {string} sessionId - Optional session ID to resume conversation
   * @returns {Promise<Object>} Response with session_id and first question
   */
  static async startChat(sessionId = null) {
    try {
      const response = await chatbotAPI.post('/chatbot/start', {
        session_id: sessionId,
        user_agent: navigator.userAgent,
        user_ip: null // Will be determined by server
      });
      
      console.log('Chat started:', response);
      return response;
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  }

  /**
   * Send user response to chatbot
   * @param {string} sessionId - Current session ID
   * @param {string} userResponse - User's response/message
   * @returns {Promise<Object>} Response with next question or completion
   */
  static async sendResponse(sessionId, userResponse) {
    try {
      const response = await chatbotAPI.post('/chatbot/respond', {
        session_id: sessionId,
        user_response: userResponse
      });

      console.log('Response received : ', response);
      
      return response;
    } catch (error) {
      console.error('Error sending response:', error);
      throw error;
    }
  }

  /**
   * Submit satisfaction response
   * @param {string} sessionId - Current session ID
   * @param {boolean} isSatisfied - Whether user is satisfied
   * @param {string} feedback - Optional feedback text
   * @returns {Promise<Object>} Final response
   */
  static async submitSatisfaction(sessionId, isSatisfied, feedback = '') {
    try {
      const response = await chatbotAPI.post('/chatbot/satisfaction', {
        session_id: sessionId,
        is_satisfied: isSatisfied,
        feedback: feedback
      });
      
      return response;
    } catch (error) {
      console.error('Error submitting satisfaction:', error);
      throw error;
    }
  }

  // Admin methods (require authentication)
  
  /**
   * Get all conversations for admin dashboard
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} status - Filter by status
   * @returns {Promise<Object>} Conversations list with pagination
   */
  static async getConversations(page = 1, limit = 20, status = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }
      
      const response = await chatbotAPI.get(`/admin/chatbot/conversations?${params}`, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  /**
   * Get detailed conversation with all messages
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Detailed conversation data
   */
  static async getConversationDetails(conversationId) {
    try {
      const response = await chatbotAPI.get(`/admin/chatbot/conversations/${conversationId}`, {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      throw error;
    }
  }

  /**
   * Get chatbot analytics and statistics
   * @returns {Promise<Object>} Analytics data
   */
  static async getStats() {
    try {
      const response = await chatbotAPI.get('/admin/chatbot/stats', {withCredentials: true});
      return response;
    } catch (error) {
      console.error('Error fetching chatbot stats:', error);
      throw error;
    }
  }

  // Utility methods

  /**
   * Test if the chatbot service is available
   * @returns {Promise<boolean>} Service availability
   */
  static async testConnection() {
    try {
      const response = await chatbotAPI.get('/debug/simple-test');
      return response.success || false;
    } catch (error) {
      console.error('Chatbot service unavailable:', error);
      return false;
    }
  }

  /**
   * Get user's conversation history (if implemented)
   * @param {string} userEmail - User's email
   * @returns {Promise<Object>} User's conversation history
   */
  static async getUserHistory(userEmail) {
    try {
      const response = await chatbotAPI.get(`/chatbot/history/${encodeURIComponent(userEmail)}`);
      return response;
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw error;
    }
  }

  /**
   * Clear user's conversation data
   * @param {string} sessionId - Session ID to clear
   * @returns {Promise<Object>} Confirmation response
   */
  static async clearSession(sessionId) {
    try {
      const response = await chatbotAPI.delete(`/chatbot/session/${sessionId}`);
      return response;
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  }
}

export default ChatbotService;