import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaArrowRight, FaTimes } from 'react-icons/fa';
import { FiLoader } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

const ScheduleVisitModal = ({ isOpen, onClose, propertyId }) => {
  const [bookingTypes, setBookingTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchBookingTypes();
    }
  }, [isOpen]);

  const fetchBookingTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/tidycal/booking-types`, {
        withCredentials: true,
        params: {
          page: 1,
          per_page: 30
        }
      });
      
      if (response.data && response.data.data) {
        // Filter valid booking types
        const validBookingTypes = response.data.data.filter(bookingType => 
          bookingType && 
          bookingType.id && 
          bookingType.title && 
          bookingType.booking_page_url &&
          !bookingType.deleted_at &&
          !bookingType.disabled_at
        );
        setBookingTypes(validBookingTypes);
      } else {
        setError('No booking options available');
      }
    } catch (err) {
      console.error('Error fetching booking types:', err);
      setError(err.response?.data?.detail || 'Failed to load booking options');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  const formatPrice = (price, currencyCode = 'USD') => {
    if (!price || price === '0.00') return 'Free';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    
    return formatter.format(parseFloat(price));
  };

  const handleBookingSelect = (bookingType) => {
    // Open booking page in new tab
    window.open(bookingType.booking_page_url, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-darkest)]">Schedule a Visit</h2>
            <p className="text-[var(--color-muted)] mt-1">Choose your preferred time slot</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="animate-spin text-[var(--color-secondary)] text-2xl mr-3" />
              <span className="text-[var(--color-muted)]">Loading booking options...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <FaCalendarAlt className="text-4xl mx-auto mb-2" />
                <p className="text-lg font-semibold">Unable to load booking options</p>
                <p className="text-sm text-[var(--color-muted)] mt-1">{error}</p>
              </div>
              <button
                onClick={fetchBookingTypes}
                className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-darker)] transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && bookingTypes.length === 0 && (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-[var(--color-muted)] text-4xl mx-auto mb-4" />
              <p className="text-lg font-semibold text-[var(--color-darkest)]">No booking options available</p>
              <p className="text-[var(--color-muted)]">Please contact the property manager directly</p>
            </div>
          )}

          {!loading && !error && bookingTypes.length > 0 && (
            <div className="space-y-4">
              {bookingTypes.map((bookingType) => (
                <div
                  key={bookingType.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[var(--color-secondary)] hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleBookingSelect(bookingType)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[var(--color-darkest)] mb-2">
                        {bookingType.title}
                      </h3>
                      
                      {bookingType.description && (
                        <p className="text-[var(--color-muted)] text-sm mb-3 line-clamp-2">
                          {bookingType.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-[var(--color-medium)]">
                        <div className="flex items-center gap-1">
                          <FaClock className="text-[var(--color-secondary)]" />
                          <span>{formatDuration(bookingType.duration_minutes)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-[var(--color-secondary)]">
                            {formatPrice(bookingType.price, bookingType.currency_code)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <FaArrowRight className="text-[var(--color-secondary)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="text-center text-sm text-[var(--color-muted)]">
            <p>Clicking on a time slot will open the booking page in a new tab</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;