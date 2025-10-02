import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMessageSquare,
  FiCheck,
  FiX,
  FiHome,
  FiMapPin,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { PropertyContext } from '../stores/propertyStore';
import ScheduleMeetingService from '../services/scheduleMeetingService';

const STEPS = {
  PROPERTY_INFO: 1,
  PERSONAL_INFO: 2,
  DATE_TIME: 3,
  MESSAGE: 4,
  CONFIRMATION: 5
};

const ScheduleMeeting = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { fetchProperty, currentProperty, propertyLoading } = React.useContext(PropertyContext);

  // Form state
  const [currentStep, setCurrentStep] = useState(STEPS.PROPERTY_INFO);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    meeting_date: '',
    meeting_time: '',
    property_id: propertyId || '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId);
      setFormData(prev => ({ ...prev, property_id: propertyId }));
    }
  }, [propertyId]);

  useEffect(() => {
    if (selectedDate) {
      const timeSlots = ScheduleMeetingService.getAvailableTimeSlots(selectedDate);
      setAvailableTimeSlots(timeSlots);
    }
  }, [selectedDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case STEPS.PERSONAL_INFO:
        if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
          newErrors.full_name = 'Full name must be at least 2 characters long';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
          newErrors.phone = 'Phone number must be at least 10 digits';
        }
        break;

      case STEPS.DATE_TIME:
        if (!formData.meeting_date) {
          newErrors.meeting_date = 'Please select a meeting date';
        }
        if (!formData.meeting_time) {
          newErrors.meeting_time = 'Please select a meeting time';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const meetingData = ScheduleMeetingService.formatMeetingData(formData);
      const validation = ScheduleMeetingService.validateMeetingData(meetingData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error('Please fix the validation errors');
        setLoading(false);
        return;
      }

      const response = await ScheduleMeetingService.scheduleMeeting(meetingData);
      
      if (response.success) {
        setSubmissionResult(response.data);
        setCurrentStep(STEPS.CONFIRMATION);
        toast.success('Meeting scheduled successfully!');
      } else {
        toast.error(response.message || 'Failed to schedule meeting');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error(error.message || 'Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateSelect = (date) => {
    if (!date) return;
    
    const dateString = date.toISOString().split('T')[0];
    
    if (!ScheduleMeetingService.isDateAvailable(dateString)) {
      toast.error('This date is not available for scheduling');
      return;
    }
    
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, meeting_date: dateString }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderProgressBar = () => {
    const progress = ((currentStep - 1) / (Object.keys(STEPS).length - 1)) * 100;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {Object.keys(STEPS).length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderPropertyInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiHome className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Property Viewing</h2>
        <p className="text-gray-600">Let's schedule a meeting to view this property</p>
      </div>

      {currentProperty && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <img
              src={currentProperty.media?.[0]?.url || '/Home1.jpg'}
              alt={currentProperty.title}
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => { e.target.src = '/Home1.jpg'; }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentProperty.title}
              </h3>
              <div className="flex items-center text-gray-600 mb-2">
                <FiMapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {currentProperty.address}, {currentProperty.city}, {currentProperty.state}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{currentProperty.bedrooms} bed</span>
                <span>{currentProperty.bathrooms} bath</span>
                <span className="font-semibold text-blue-600">
                  ${currentProperty.price?.toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Continue</span>
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiUser className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Information</h2>
        <p className="text-gray-600">Please provide your contact details</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {errors.full_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <FaChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Continue</span>
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderDateTimeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCalendar className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-600">Choose your preferred meeting date and time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Date</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-lg font-medium text-gray-900 min-w-40 text-center">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2"></div>;
              }

              const dateString = date.toISOString().split('T')[0];
              const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
              const isAvailable = ScheduleMeetingService.isDateAvailable(dateString);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  disabled={!isAvailable}
                  className={`p-2 text-sm rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : isAvailable
                      ? 'hover:bg-blue-100 text-gray-900'
                      : 'text-gray-400 cursor-not-allowed'
                  } ${isToday && !isSelected ? 'bg-blue-50 border border-blue-200' : ''}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {errors.meeting_date && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {errors.meeting_date}
            </p>
          )}
        </div>

        {/* Time Selection */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
          
          {selectedDate ? (
            <>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Selected Date:</strong> {formatDate(selectedDate)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                {availableTimeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => handleInputChange('meeting_time', slot.value)}
                    disabled={!slot.available}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      formData.meeting_time === slot.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : slot.available
                        ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.display}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Please select a date first</p>
            </div>
          )}

          {errors.meeting_time && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="w-4 h-4 mr-1" />
              {errors.meeting_time}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <FaChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Continue</span>
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderMessage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiMessageSquare className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Message</h2>
        <p className="text-gray-600">Any additional information or questions? (Optional)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          placeholder="Let us know if you have any specific questions about the property, preferred tour duration, or any special requirements..."
        />
        <p className="mt-1 text-sm text-gray-500">
          This helps us prepare better for your visit
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="text-gray-900 font-medium">{formData.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="text-gray-900 font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="text-gray-900 font-medium">{formData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-900 font-medium">
              {selectedDate ? formatDate(selectedDate) : 'Not selected'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="text-gray-900 font-medium">
              {formData.meeting_time ? 
                new Date(`2000-01-01T${formData.meeting_time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }) : 'Not selected'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <FaChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 bg-green-400 rounded animate-pulse"></div>
              <span>Scheduling...</span>
            </>
          ) : (
            <>
              <FiCheck className="w-4 h-4" />
              <span>Schedule Meeting</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <FiCheck className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Meeting Scheduled!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your meeting request has been submitted successfully.
        </p>
      </div>

      {submissionResult && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
          <h3 className="text-lg font-semibold text-green-800 mb-4">What happens next?</h3>
          <div className="space-y-3 text-sm text-green-700">
            <div className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 mt-0.5 text-green-600" />
              <span>You will receive a confirmation email shortly</span>
            </div>
            <div className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 mt-0.5 text-green-600" />
              <span>Our team will review your request and get back to you within 24 hours</span>
            </div>
            <div className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 mt-0.5 text-green-600" />
              <span>You'll receive meeting details and any additional instructions</span>
            </div>
          </div>
          
          {submissionResult.meeting_id && (
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-xs text-gray-600">Meeting Reference ID:</p>
              <p className="font-mono text-sm text-gray-900">{submissionResult.meeting_id}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={`/properties/${propertyId}`}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Property
        </Link>
        <Link
          to="/properties"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse More Properties
        </Link>
      </div>
    </div>
  );

  // Skeleton component for property loading
  const PropertySkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar Skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Icon Skeleton */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="w-48 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Property Card Skeleton */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-3">
                <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex space-x-4">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-end">
            <div className="w-28 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (propertyLoading) {
    return <PropertySkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to={`/properties/${propertyId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Property
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {renderProgressBar()}
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === STEPS.PROPERTY_INFO && renderPropertyInfo()}
          {currentStep === STEPS.PERSONAL_INFO && renderPersonalInfo()}
          {currentStep === STEPS.DATE_TIME && renderDateTimeSelection()}
          {currentStep === STEPS.MESSAGE && renderMessage()}
          {currentStep === STEPS.CONFIRMATION && renderConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;