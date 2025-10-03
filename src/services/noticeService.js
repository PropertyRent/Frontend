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

class NoticeService {
  // === PUBLIC METHODS ===

  /**
   * Get active notices for public viewing
   */
  static async getActiveNotices(params = {}) {
    try {
      const { limit = 10, offset = 0, search } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (search) {
        queryParams.append('search', search);
      }

      const response = await api.get(`/public/notices/active?${queryParams}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch active notices');
      }
    } catch (error) {
      console.error('Error fetching active notices:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to fetch notices',
        data: null
      };
    }
  }

  // === ADMIN METHODS ===

  /**
   * Get all notices (admin only)
   */
  static async getAllNotices(params = {}) {
    try {
      const { limit = 10, offset = 0, search } = params;
      
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (search) {
        queryParams.append('search', search);
      }

      const response = await api.get(`/admin/notices?${queryParams}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch notices');
      }
    } catch (error) {
      console.error('Error fetching all notices:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to fetch notices',
        data: null
      };
    }
  }

  /**
   * Get a single notice by ID (admin only)
   */
  static async getNoticeById(noticeId) {
    try {
      const response = await api.get(`/admin/notices/${noticeId}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch notice');
      }
    } catch (error) {
      console.error('Error fetching notice:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to fetch notice',
        data: null
      };
    }
  }

  /**
   * Create a new notice (admin only)
   */
  static async createNotice(noticeData) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', noticeData.title);
      if (noticeData.description) {
        formData.append('description', noticeData.description);
      }
      
      // Add file if provided
      if (noticeData.file) {
        formData.append('notice_file', noticeData.file);
      }

      const response = await api.post('/admin/notices', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to create notice');
      }
    } catch (error) {
      console.error('Error creating notice:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to create notice',
        data: null
      };
    }
  }

  /**
   * Update an existing notice (admin only)
   */
  static async updateNotice(noticeId, noticeData) {
    try {
      const formData = new FormData();
      
      // Add text fields if provided
      if (noticeData.title !== undefined) {
        formData.append('title', noticeData.title);
      }
      if (noticeData.description !== undefined) {
        formData.append('description', noticeData.description || '');
      }
      
      // Add file if provided
      if (noticeData.file) {
        formData.append('notice_file', noticeData.file);
      }

      const response = await api.put(`/admin/notices/${noticeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to update notice');
      }
    } catch (error) {
      console.error('Error updating notice:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to update notice',
        data: null
      };
    }
  }

  /**
   * Delete a notice (admin only)
   */
  static async deleteNotice(noticeId) {
    try {
      const response = await api.delete(`/admin/notices/${noticeId}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to delete notice');
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to delete notice'
      };
    }
  }

  /**
   * Toggle notice active status (admin only)
   */
  static async toggleNoticeActive(noticeId) {
    try {
      const response = await api.patch(`/admin/notices/${noticeId}/toggle-active`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to toggle notice status');
      }
    } catch (error) {
      console.error('Error toggling notice status:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to toggle notice status',
        data: null
      };
    }
  }

  /**
   * Set notice active status (admin only)
   */
  static async setNoticeActive(noticeId, isActive) {
    try {
      const formData = new FormData();
      formData.append('is_active', isActive.toString());

      const response = await api.put(`/admin/notices/${noticeId}/set-active`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to set notice status');
      }
    } catch (error) {
      console.error('Error setting notice status:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to set notice status',
        data: null
      };
    }
  }

  // === UTILITY METHODS ===

  /**
   * Format notice date for display
   */
  static formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename) {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  }

  /**
   * Get file extension from content type
   */
  static getExtensionFromContentType(contentType) {
    const mimeToExt = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'text/plain': 'txt',
      'application/zip': 'zip',
      'application/x-zip-compressed': 'zip',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
    };
    
    return mimeToExt[contentType.toLowerCase()] || '';
  }

  /**
   * Check if file is an image
   */
  static isImageFile(filename) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = this.getFileExtension(filename);
    return imageExtensions.includes(extension);
  }

  /**
   * Check if file is a document
   */
  static isDocumentFile(filename) {
    const documentExtensions = ['pdf', 'doc', 'docx'];
    const extension = this.getFileExtension(filename);
    return documentExtensions.includes(extension);
  }

  /**
   * Get file type icon
   */
  static getFileTypeIcon(filename) {
    const extension = this.getFileExtension(filename);
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return '🖼️';
      default:
        return '📎';
    }
  }

  /**
   * Validate file before upload
   */
  static validateFile(file) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please use PDF, DOC, DOCX, or image files.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 10MB'
      };
    }

    return { isValid: true };
  }

  /**
   * Create file download URL from base64 data
   */
  static createDownloadUrl(base64Data, fileType, filename) {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      
      // Determine proper MIME type if not provided or generic
      let mimeType = fileType;
      if (!mimeType || mimeType === 'application/octet-stream') {
        const extension = this.getFileExtension(filename);
        mimeType = this.getMimeTypeFromExtension(extension);
      }
      
      const blob = new Blob([byteArray], { type: mimeType });
      
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating download URL:', error);
      return null;
    }
  }

  /**
   * Get MIME type from file extension
   */
  static getMimeTypeFromExtension(extension) {
    const extToMime = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'txt': 'text/plain',
      'zip': 'application/zip',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };
    
    return extToMime[extension?.toLowerCase()] || 'application/octet-stream';
  }

  /**
   * Download file using backend endpoint
   */
  static async downloadNoticeFile(noticeId, isAdmin = false) {
    try {
      const endpoint = isAdmin 
        ? `/admin/notices/${noticeId}/download`
        : `/notices/${noticeId}/download`;

      const response = await api.get(endpoint, {
        responseType: 'blob'
      });
       
      if (!response.data) {
        throw new Error('No file data received');
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Get content type from response headers
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      
      // If filename doesn't have extension, try to add it based on content type
      if (!filename.includes('.') && contentType) {
        const extension = this.getExtensionFromContentType(contentType);
        if (extension) {
          filename += `.${extension}`;
        }
      }

      // Create blob with proper content type
      const blob = new Blob([response.data], { type: contentType });
      const downloadUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      
      return {
        success: true,
        message: 'File downloaded successfully',
        filename: filename
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || 'Failed to download file'
      };
    }
  }

  /**
   * Download file from base64 data (fallback method)
   */
  static downloadFile(base64Data, fileType, filename) {
    try {
      // Ensure filename has proper extension
      let properFilename = filename;
      if (!properFilename.includes('.') && fileType) {
        const extension = this.getExtensionFromContentType(fileType);
        if (extension) {
          properFilename += `.${extension}`;
        }
      }

      const downloadUrl = this.createDownloadUrl(base64Data, fileType, properFilename);
      if (!downloadUrl) return false;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = properFilename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
      
      return {
        success: true,
        filename: properFilename
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default NoticeService;