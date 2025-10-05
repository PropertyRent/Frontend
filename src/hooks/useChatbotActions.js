import { useContext } from 'react';
import { PropertyContext } from '../stores/propertyStore';
import ContactService from '../services/contactService';
import toast from 'react-hot-toast';

/**
 * Custom hook to handle Support Board chatbot actions
 * Parses JSON responses from the chatbot and executes corresponding backend API calls
 */
export const useChatbotActions = () => {
  const { properties, setProperties } = useContext(PropertyContext);

  /**
   * Parse JSON action from chatbot response and execute corresponding function
   * @param {string} jsonString - JSON string from chatbot response
   * @returns {Promise<string>} - Response message for the chatbot
   */
  const handleChatbotAction = async (jsonString) => {
    try {
      const action = JSON.parse(jsonString);
      
      switch (action.action) {
        case 'get_properties':
          return await handleGetProperties(action.filters || {});
        
        case 'apply_property':
          return await handleApplyProperty(action);
        
        case 'submit_contact':
          return await handleSubmitContact(action);
        
        default:
          return 'I can help you with finding properties, submitting applications, or contacting us. How can I assist you today?';
      }
    } catch (error) {
      console.error('Error parsing chatbot action:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again or contact us directly.';
    }
  };

  /**
   * Handle property search requests
   * @param {Object} filters - Search filters from chatbot
   * @returns {Promise<string>} - Formatted property results
   */
  const handleGetProperties = async (filters) => {
    try {
      // Use existing properties from context or fetch new ones based on filters
      let filteredProperties = properties;

      // Apply filters if provided
      if (filters.location) {
        filteredProperties = properties.filter(property =>
          property.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
          property.city?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.property_type) {
        filteredProperties = filteredProperties.filter(property =>
          property.property_type?.toLowerCase() === filters.property_type.toLowerCase()
        );
      }

      if (filters.min_rent) {
        filteredProperties = filteredProperties.filter(property =>
          parseFloat(property.rent) >= parseFloat(filters.min_rent)
        );
      }

      if (filters.max_rent) {
        filteredProperties = filteredProperties.filter(property =>
          parseFloat(property.rent) <= parseFloat(filters.max_rent)
        );
      }

      if (filters.bedrooms) {
        filteredProperties = filteredProperties.filter(property =>
          parseInt(property.bedrooms) >= parseInt(filters.bedrooms)
        );
      }

      if (filters.bathrooms) {
        filteredProperties = filteredProperties.filter(property =>
          parseInt(property.bathrooms) >= parseInt(filters.bathrooms)
        );
      }

      // Format response
      if (filteredProperties.length === 0) {
        return "I couldn't find any properties matching your criteria. Would you like to adjust your search parameters or contact us for more options?";
      }

      const propertyList = filteredProperties.slice(0, 5).map(property => {
        const rent = property.rent ? `$${parseFloat(property.rent).toLocaleString()}` : 'Contact for pricing';
        const beds = property.bedrooms || 'N/A';
        const baths = property.bathrooms || 'N/A';
        const address = property.address || property.city || 'Address available upon request';
        
        return `🏠 ${property.title || 'Property Available'}\n` +
               `📍 ${address}\n` +
               `🛏️ ${beds} bed, 🚿 ${baths} bath\n` +
               `💰 ${rent}/month\n` +
               `Status: ${property.status || 'Available'}\n`;
      }).join('\n---\n');

      const totalFound = filteredProperties.length;
      const showingCount = Math.min(5, totalFound);

      return `I found ${totalFound} properties matching your criteria. Here are the first ${showingCount}:\n\n${propertyList}\n\nWould you like to schedule a visit or get more information about any of these properties?`;

    } catch (error) {
      console.error('Error fetching properties:', error);
      return 'I encountered an error while searching for properties. Please try again or contact us directly at (315) 834-0010.';
    }
  };

  /**
   * Handle property application submissions
   * @param {Object} action - Application data from chatbot
   * @returns {Promise<string>} - Application confirmation message
   */
  const handleApplyProperty = async (action) => {
    try {
      const { property_id, applicant_name, applicant_email, applicant_phone, applicant_message } = action;

      if (!property_id || !applicant_name || !applicant_email) {
        return 'To submit an application, I need at least your name, email, and the property you\'re interested in. Could you please provide these details?';
      }

      // Find the property
      const property = properties.find(p => p._id === property_id || p.title?.toLowerCase().includes(property_id.toLowerCase()));
      
      if (!property) {
        return 'I couldn\'t find the property you\'re referring to. Could you please specify which property you\'d like to apply for?';
      }

      // Submit application via contact form (using existing backend endpoint)
      const applicationData = {
        full_name: applicant_name,
        email: applicant_email,
        phone: applicant_phone || '',
        message: applicant_message || `Application for property: ${property.title || property._id}\n\nI am interested in applying for this rental property. Please contact me with next steps and application requirements.\n\nProperty Details:\n- Location: ${property.address || property.city || 'N/A'}\n- Rent: $${property.rent || 'Contact for pricing'}\n- Bedrooms: ${property.bedrooms || 'N/A'}\n- Bathrooms: ${property.bathrooms || 'N/A'}`
      };

      const response = await ContactService.submitContact(applicationData);

      if (response.success) {
        toast.success('Application submitted successfully!');
        return `✅ Your application for "${property.title || 'the selected property'}" has been submitted successfully!\n\n` +
               `We've received your information:\n` +
               `👤 Name: ${applicant_name}\n` +
               `📧 Email: ${applicant_email}\n` +
               `${applicant_phone ? `📞 Phone: ${applicant_phone}\n` : ''}` +
               `\nOur team will review your application and contact you within 1-2 business days with next steps.\n\n` +
               `For urgent inquiries, call us at (315) 834-0010.`;
      } else {
        throw new Error(response.message || 'Failed to submit application');
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      return `I encountered an error while submitting your application. Please try contacting us directly at:\n\n📞 Phone: (315) 834-0010\n📧 Email: admin@gmprentals.com\n\nOr visit our contact page to submit your application manually.`;
    }
  };

  /**
   * Handle general contact form submissions
   * @param {Object} action - Contact data from chatbot
   * @returns {Promise<string>} - Contact confirmation message
   */
  const handleSubmitContact = async (action) => {
    try {
      const { name, email, phone, message } = action;

      if (!name || !email || !message) {
        return 'To send a message, I need your name, email, and your message. Could you please provide these details?';
      }

      const contactData = {
        full_name: name,
        email: email,
        phone: phone || '',
        message: message
      };

      const response = await ContactService.submitContact(contactData);

      if (response.success) {
        toast.success('Message sent successfully!');
        return `✅ Your message has been sent successfully!\n\n` +
               `We've received your inquiry from ${name} (${email}).\n\n` +
               `Our team will get back to you within 1 business day.\n\n` +
               `For urgent matters, call us at (315) 834-0010.\n\n` +
               `Thank you for contacting GMP Rentals!`;
      } else {
        throw new Error(response.message || 'Failed to send message');
      }

    } catch (error) {
      console.error('Error submitting contact:', error);
      return `I encountered an error while sending your message. Please try contacting us directly at:\n\n📞 Phone: (315) 834-0010\n📧 Email: admin@gmprentals.com\n\nThank you for your patience!`;
    }
  };

  return {
    handleChatbotAction
  };
};

export default useChatbotActions;