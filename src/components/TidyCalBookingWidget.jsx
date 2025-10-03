import React, { useState, useEffect } from 'react';
import { FiCalendar, FiExternalLink, FiLoader, FiAlertCircle } from 'react-icons/fi';
import tidyCalService from '../services/tidyCalService';

const TidyCalBookingWidget = ({ 
  propertyId, 
  width = '100%', 
  height = '600px',
  showDirectLink = true,
  className = '',
  onBookingAvailable,
  onBookingUnavailable 
}) => {
  const [embedData, setEmbedData] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (propertyId) {
      checkBookingAvailability();
    }
  }, [propertyId]);

  const checkBookingAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First check if booking is available for this property
      const statusResponse = await tidyCalService.checkPropertyBookingAvailability(propertyId);
      
      if (statusResponse.success) {
        setBookingStatus(statusResponse.data);
        
        if (statusResponse.data.has_booking_available) {
          // Fetch embed code if booking is available
          const embedResponse = await tidyCalService.getPropertyBookingEmbed(propertyId, width, height);
          
          if (embedResponse.success) {
            setEmbedData(embedResponse.data);
            if (onBookingAvailable) {
              onBookingAvailable(statusResponse.data);
            }
          } else {
            setError('Failed to load booking widget');
          }
        } else {
          if (onBookingUnavailable) {
            onBookingUnavailable(statusResponse.data);
          }
        }
      } else {
        setError(statusResponse.error || 'Failed to check booking availability');
      }
    } catch (error) {
      console.error('Error checking booking availability:', error);
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const openBookingInNewTab = () => {
    if (bookingStatus && bookingStatus.booking_url) {
      window.open(bookingStatus.booking_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
        <FiLoader className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-gray-600">Loading booking information...</p>
      </div>
    );
  }

  if (error || !bookingStatus) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg border border-red-200 ${className}`}>
        <FiAlertCircle className="w-8 h-8 text-red-500 mb-3" />
        <p className="text-sm text-red-600 text-center">{error || 'Booking unavailable'}</p>
        <button 
          onClick={checkBookingAvailability}
          className="mt-3 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!bookingStatus.has_booking_available) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 bg-yellow-50 rounded-lg border border-yellow-200 ${className}`}>
        <FiCalendar className="w-8 h-8 text-yellow-500 mb-3" />
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Booking Unavailable</h3>
        <p className="text-sm text-yellow-700 text-center">
          {bookingStatus.message || 'Property viewing booking is not available for this property'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with direct link */}
      {showDirectLink && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-1">
              Schedule Property Viewing
            </h3>
            <p className="text-sm text-blue-700">
              {bookingStatus.page_name} - {bookingStatus.duration_minutes} minutes
            </p>
            {bookingStatus.description && (
              <p className="text-sm text-blue-600 mt-1">{bookingStatus.description}</p>
            )}
          </div>
          <button
            onClick={openBookingInNewTab}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiExternalLink className="w-4 h-4 mr-2" />
            Book Now
          </button>
        </div>
      )}

      {/* Embedded booking widget */}
      {embedData && (
        <div className="relative">
          <div 
            className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
            dangerouslySetInnerHTML={{ __html: embedData.embed_code }}
          />
          
          {/* Fallback for iframe issues */}
          <noscript>
            <div className="flex flex-col items-center justify-center py-12 bg-blue-50 rounded-lg border border-blue-200">
              <FiCalendar className="w-8 h-8 text-blue-600 mb-3" />
              <p className="text-sm text-blue-700 mb-3">JavaScript is required for the booking widget.</p>
              <a
                href={embedData.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiExternalLink className="w-4 h-4 mr-2" />
                Open Booking Page
              </a>
            </div>
          </noscript>
        </div>
      )}

      {/* Additional booking info */}
      <div className="flex items-center justify-center text-xs text-gray-500">
        <FiCalendar className="w-3 h-3 mr-1" />
        Powered by TidyCal - Secure online booking
      </div>
    </div>
  );
};

export default TidyCalBookingWidget;