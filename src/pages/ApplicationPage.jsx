import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiUser, 
  FiHome,
  FiBriefcase,
  FiShield,
  FiUsers,
  FiInfo,
  FiFileText,
  FiDollarSign,
  FiCheck,
  FiX,
  FiSkipForward,
  FiAlertCircle,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCalendar,
  FiCreditCard,
  FiLoader
} from 'react-icons/fi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { PropertyContext } from '../stores/propertyStore';
import ApplicationService from '../services/applicationService';

const STEPS = {
  PROPERTY_INFO: 1,
  PERSONAL_INFO: 2,
  RESIDENTIAL_HISTORY: 3,
  EMPLOYMENT_INCOME: 4,
  CREDIT_BACKGROUND: 5,
  REFERENCES: 6,
  ADDITIONAL_INFO: 7,
  SIGNATURE_TERMS: 8,
  REVIEW_SUBMIT: 9,
  CONFIRMATION: 10
};

const STEP_TITLES = {
  [STEPS.PROPERTY_INFO]: 'Property Information',
  [STEPS.PERSONAL_INFO]: 'Personal Information',
  [STEPS.RESIDENTIAL_HISTORY]: 'Residential History',
  [STEPS.EMPLOYMENT_INCOME]: 'Employment & Income',
  [STEPS.CREDIT_BACKGROUND]: 'Credit & Background Check',
  [STEPS.REFERENCES]: 'References',
  [STEPS.ADDITIONAL_INFO]: 'Additional Information',
  [STEPS.SIGNATURE_TERMS]: 'Signature & Terms',
  [STEPS.REVIEW_SUBMIT]: 'Review & Submit',
  [STEPS.CONFIRMATION]: 'Application Submitted'
};

const STEP_ICONS = {
  [STEPS.PROPERTY_INFO]: FiHome,
  [STEPS.PERSONAL_INFO]: FiUser,
  [STEPS.RESIDENTIAL_HISTORY]: FiMapPin,
  [STEPS.EMPLOYMENT_INCOME]: FiBriefcase,
  [STEPS.CREDIT_BACKGROUND]: FiShield,
  [STEPS.REFERENCES]: FiUsers,
  [STEPS.ADDITIONAL_INFO]: FiInfo,
  [STEPS.SIGNATURE_TERMS]: FiFileText,
  [STEPS.REVIEW_SUBMIT]: FiCheck,
  [STEPS.CONFIRMATION]: FiCheck
};

const ApplicationPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { fetchProperty, currentProperty, propertyLoading } = useContext(PropertyContext);

  // Form state
  const [currentStep, setCurrentStep] = useState(STEPS.PROPERTY_INFO);
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState(
    ApplicationService.createEmptyApplication(propertyId)
  );
  const [errors, setErrors] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId);
      setApplicationData(prev => ({ ...prev, property_id: propertyId }));
    }
  }, [propertyId]);

  const handleInputChange = (section, field, value, nestedField = null) => {
    setApplicationData(prev => {
      const newData = { ...prev };
      
      if (nestedField) {
        if (!newData[section]) newData[section] = {};
        if (!newData[section][field]) newData[section][field] = {};
        newData[section][field][nestedField] = value;
      } else if (field) {
        if (!newData[section]) newData[section] = {};
        newData[section][field] = value;
      } else {
        newData[section] = value;
      }
      
      return newData;
    });

    // Clear errors for this field
    const errorKey = nestedField ? `${section}.${field}.${nestedField}` : `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleArrayAdd = (section, field, emptyItem) => {
    setApplicationData(prev => {
      const newData = { ...prev };
      if (!newData[section]) newData[section] = {};
      if (!newData[section][field]) newData[section][field] = [];
      newData[section][field] = [...newData[section][field], emptyItem];
      return newData;
    });
  };

  const handleArrayRemove = (section, field, index) => {
    setApplicationData(prev => {
      const newData = { ...prev };
      if (newData[section] && newData[section][field]) {
        newData[section][field] = newData[section][field].filter((_, i) => i !== index);
      }
      return newData;
    });
  };

  const handleArrayUpdate = (section, field, index, updates) => {
    setApplicationData(prev => {
      const newData = { ...prev };
      if (newData[section] && newData[section][field] && newData[section][field][index]) {
        newData[section][field][index] = { ...newData[section][field][index], ...updates };
      }
      return newData;
    });
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case STEPS.PERSONAL_INFO:
        const personal = applicationData.personal_information;
        if (!personal?.full_name?.trim()) newErrors['personal_information.full_name'] = 'Full name is required';
        if (!personal?.email?.trim()) {
          newErrors['personal_information.email'] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) {
          newErrors['personal_information.email'] = 'Please enter a valid email address';
        }
        if (!personal?.phone_number?.trim()) newErrors['personal_information.phone_number'] = 'Phone number is required';
        break;

      case STEPS.SIGNATURE_TERMS:
        const terms = applicationData.signature_acknowledgment?.terms_acknowledgment;
        if (!terms?.agree_to_lease_terms) newErrors['signature_acknowledgment.terms_acknowledgment.agree_to_lease_terms'] = 'You must agree to the lease terms';
        if (!terms?.consent_to_background_credit_checks) newErrors['signature_acknowledgment.terms_acknowledgment.consent_to_background_credit_checks'] = 'Background check consent is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSkipStep = (step) => {
    const skippableSteps = [
      STEPS.RESIDENTIAL_HISTORY,
      STEPS.EMPLOYMENT_INCOME,
      STEPS.CREDIT_BACKGROUND,
      STEPS.REFERENCES,
      STEPS.ADDITIONAL_INFO
    ];
    return skippableSteps.includes(step);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSkip = () => {
    if (canSkipStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const validation = ApplicationService.validateApplicationData(applicationData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        toast.error('Please fix the validation errors');
        setLoading(false);
        return;
      }

      const response = await ApplicationService.submitApplication(applicationData);
      
      if (response.success) {
        setSubmissionResult(response.data);
        setCurrentStep(STEPS.CONFIRMATION);
        toast.success('Application submitted successfully!');
      } else {
        toast.error(response.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    const totalSteps = Object.keys(STEPS).length - 1; // Exclude confirmation step
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}: {STEP_TITLES[currentStep]}
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

  const renderStepIcon = (step) => {
    const IconComponent = STEP_ICONS[step];
    const isCompleted = completedSteps.has(step);
    const isCurrent = currentStep === step;
    
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isCompleted ? 'bg-green-500 text-white' :
        isCurrent ? 'bg-blue-500 text-white' :
        'bg-gray-200 text-gray-400'
      }`}>
        {isCompleted ? (
          <FiCheck className="w-4 h-4" />
        ) : (
          <IconComponent className="w-4 h-4" />
        )}
      </div>
    );
  };

  const renderResidentialHistory = () => {
    const residential = applicationData.residential_history || {};
    const currentAddress = residential.current_address || {};
    const previousAddresses = residential.previous_addresses || [];
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.RESIDENTIAL_HISTORY)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Residential History</h2>
          <p className="text-gray-600">Current and previous addresses (optional)</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            <FiSkipForward className="w-3 h-3 mr-1" />
            This section can be skipped
          </div>
        </div>

        {/* Current Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={currentAddress.street_address || ''}
                onChange={(e) => handleInputChange('residential_history', 'current_address', e.target.value, 'street_address')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter current street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={currentAddress.city || ''}
                onChange={(e) => handleInputChange('residential_history', 'current_address', e.target.value, 'city')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={currentAddress.state || ''}
                onChange={(e) => handleInputChange('residential_history', 'current_address', e.target.value, 'state')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                value={currentAddress.zip_code || ''}
                onChange={(e) => handleInputChange('residential_history', 'current_address', e.target.value, 'zip_code')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ZIP Code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={currentAddress.monthly_rent || ''}
                  onChange={(e) => handleInputChange('residential_history', 'current_address', parseFloat(e.target.value) || '', 'monthly_rent')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Move-in Date</label>
              <input
                type="date"
                value={currentAddress.move_in_date || ''}
                onChange={(e) => handleInputChange('residential_history', 'current_address', e.target.value, 'move_in_date')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Moving</label>
              <textarea
                value={currentAddress.reason_for_moving || ''}
                onChange={(e) => handleInputChange('residential_history', 'current_address', e.target.value, 'reason_for_moving')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Why are you moving from your current address?"
              />
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
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FiSkipForward className="w-4 h-4" />
              <span>Skip</span>
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
      </div>
    );
  };

  const renderEmploymentIncome = () => {
    const employment = applicationData.employment_income || {};
    const currentEmployer = employment.current_employer || {};
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.EMPLOYMENT_INCOME)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Employment & Income</h2>
          <p className="text-gray-600">Employment details and income information (optional)</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            <FiSkipForward className="w-3 h-3 mr-1" />
            This section can be skipped
          </div>
        </div>

        {/* Current Employer */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Employment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <div className="relative">
                <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={currentEmployer.company_name || ''}
                  onChange={(e) => handleInputChange('employment_income', 'current_employer', e.target.value, 'company_name')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={currentEmployer.job_title || ''}
                onChange={(e) => handleInputChange('employment_income', 'current_employer', e.target.value, 'job_title')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your position/title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={currentEmployer.monthly_income || ''}
                  onChange={(e) => handleInputChange('employment_income', 'current_employer', parseFloat(e.target.value) || '', 'monthly_income')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={currentEmployer.start_date || ''}
                onChange={(e) => handleInputChange('employment_income', 'current_employer', e.target.value, 'start_date')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={currentEmployer.phone_number || ''}
                  onChange={(e) => handleInputChange('employment_income', 'current_employer', e.target.value, 'phone_number')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Company phone number"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor Name</label>
              <input
                type="text"
                value={currentEmployer.supervisor_name || ''}
                onChange={(e) => handleInputChange('employment_income', 'current_employer', e.target.value, 'supervisor_name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Supervisor's name"
              />
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
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FiSkipForward className="w-4 h-4" />
              <span>Skip</span>
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
      </div>
    );
  };

  const renderCreditBackground = () => {
    const credit = applicationData.credit_background_check || {};
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.CREDIT_BACKGROUND)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Credit & Background Check</h2>
          <p className="text-gray-600">Credit history and background information (optional)</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            <FiSkipForward className="w-3 h-3 mr-1" />
            This section can be skipped
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Credit Score Range</label>
              <select
                value={credit.credit_score_range || ''}
                onChange={(e) => handleInputChange('credit_background_check', 'credit_score_range', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select credit score range</option>
                <option value="excellent">Excellent (750+)</option>
                <option value="good">Good (700-749)</option>
                <option value="fair">Fair (650-699)</option>
                <option value="poor">Poor (600-649)</option>
                <option value="very_poor">Very Poor (Below 600)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bankruptcy History</label>
              <select
                value={credit.bankruptcy_history || ''}
                onChange={(e) => handleInputChange('credit_background_check', 'bankruptcy_history', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select option</option>
                <option value="none">No bankruptcy history</option>
                <option value="chapter_7">Chapter 7 Bankruptcy</option>
                <option value="chapter_13">Chapter 13 Bankruptcy</option>
                <option value="discharged">Discharged bankruptcy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Eviction History</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="eviction_history"
                  value="none"
                  checked={credit.eviction_history === 'none'}
                  onChange={(e) => handleInputChange('credit_background_check', 'eviction_history', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No eviction history</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="eviction_history"
                  value="past_eviction"
                  checked={credit.eviction_history === 'past_eviction'}
                  onChange={(e) => handleInputChange('credit_background_check', 'eviction_history', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Past eviction (please explain below)</span>
              </label>
            </div>
          </div>

          {credit.eviction_history === 'past_eviction' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eviction Details</label>
              <textarea
                value={credit.eviction_details || ''}
                onChange={(e) => handleInputChange('credit_background_check', 'eviction_details', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Please explain the circumstances of the eviction"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Criminal Background</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="criminal_background"
                  value="none"
                  checked={credit.criminal_background === 'none'}
                  onChange={(e) => handleInputChange('credit_background_check', 'criminal_background', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No criminal background</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="criminal_background"
                  value="misdemeanor"
                  checked={credit.criminal_background === 'misdemeanor'}
                  onChange={(e) => handleInputChange('credit_background_check', 'criminal_background', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Misdemeanor</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="criminal_background"
                  value="felony"
                  checked={credit.criminal_background === 'felony'}
                  onChange={(e) => handleInputChange('credit_background_check', 'criminal_background', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Felony</span>
              </label>
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
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FiSkipForward className="w-4 h-4" />
              <span>Skip</span>
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
      </div>
    );
  };

  const renderReferences = () => {
    const references = applicationData.references || {};
    const personalReferences = references.personal_references || [];
    const professionalReferences = references.professional_references || [];
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.REFERENCES)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">References</h2>
          <p className="text-gray-600">Personal and professional references (optional)</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            <FiSkipForward className="w-3 h-3 mr-1" />
            This section can be skipped
          </div>
        </div>

        {/* Personal References */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Personal References</h3>
            <button
              onClick={() => handleArrayAdd('references', 'personal_references', {
                name: '',
                relationship: '',
                phone_number: '',
                email: '',
                years_known: ''
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
            >
              <span>Add Reference</span>
            </button>
          </div>
          
          {personalReferences.map((ref, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Personal Reference {index + 1}</h4>
                <button
                  onClick={() => handleArrayRemove('references', 'personal_references', index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={ref.name || ''}
                    onChange={(e) => handleArrayUpdate('references', 'personal_references', index, { name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Reference name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    value={ref.relationship || ''}
                    onChange={(e) => handleArrayUpdate('references', 'personal_references', index, { relationship: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Friend, Family"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={ref.phone_number || ''}
                    onChange={(e) => handleArrayUpdate('references', 'personal_references', index, { phone_number: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={ref.email || ''}
                    onChange={(e) => handleArrayUpdate('references', 'personal_references', index, { email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <FaChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FiSkipForward className="w-4 h-4" />
              <span>Skip</span>
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
      </div>
    );
  };

  const renderAdditionalInfo = () => {
    const additional = applicationData.additional_information || {};
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.ADDITIONAL_INFO)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Additional Information</h2>
          <p className="text-gray-600">Pets, vehicles, and other details (optional)</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
            <FiSkipForward className="w-3 h-3 mr-1" />
            This section can be skipped
          </div>
        </div>

        <div className="space-y-6">
          {/* Pet Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pet Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have pets?</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="has_pets"
                    value="no"
                    checked={additional.has_pets === 'no'}
                    onChange={(e) => handleInputChange('additional_information', 'has_pets', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">No pets</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="has_pets"
                    value="yes"
                    checked={additional.has_pets === 'yes'}
                    onChange={(e) => handleInputChange('additional_information', 'has_pets', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Yes, I have pets</span>
                </label>
              </div>
            </div>

            {additional.has_pets === 'yes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                  <input
                    type="text"
                    value={additional.pet_type || ''}
                    onChange={(e) => handleInputChange('additional_information', 'pet_type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Dog, Cat, Bird"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Pets</label>
                  <input
                    type="number"
                    value={additional.number_of_pets || ''}
                    onChange={(e) => handleInputChange('additional_information', 'number_of_pets', parseInt(e.target.value) || '', '')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number of pets"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Description</label>
                  <textarea
                    value={additional.pet_description || ''}
                    onChange={(e) => handleInputChange('additional_information', 'pet_description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Describe your pets (breed, size, age, etc.)"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Vehicles</label>
                <input
                  type="number"
                  value={additional.number_of_vehicles || ''}
                  onChange={(e) => handleInputChange('additional_information', 'number_of_vehicles', parseInt(e.target.value) || '', '')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number of vehicles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Types</label>
                <input
                  type="text"
                  value={additional.vehicle_types || ''}
                  onChange={(e) => handleInputChange('additional_information', 'vehicle_types', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Car, Truck, Motorcycle"
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests or Comments</label>
            <textarea
              value={additional.special_requests || ''}
              onChange={(e) => handleInputChange('additional_information', 'special_requests', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Any special requests, accommodation needs, or additional comments..."
            />
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
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <FiSkipForward className="w-4 h-4" />
              <span>Skip</span>
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
      </div>
    );
  };

  const renderPropertyInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        {renderStepIcon(STEPS.PROPERTY_INFO)}
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Property Application</h2>
        <p className="text-gray-600">You're applying for this property</p>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Application Process</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Complete all required sections (some sections can be skipped)</li>
          <li>• Review your information before submitting</li>
          <li>• You'll receive a confirmation email after submission</li>
          <li>• We'll review your application and get back to you within 48 hours</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>Start Application</span>
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderPersonalInfo = () => {
    const personal = applicationData.personal_information || {};
    const emergency = personal.emergency_contact || {};
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.PERSONAL_INFO)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Personal Information</h2>
          <p className="text-gray-600">Please provide your personal details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={personal.full_name || ''}
                onChange={(e) => handleInputChange('personal_information', 'full_name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['personal_information.full_name'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors['personal_information.full_name'] && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors['personal_information.full_name']}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={personal.email || ''}
                onChange={(e) => handleInputChange('personal_information', 'email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['personal_information.email'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors['personal_information.email'] && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors['personal_information.email']}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={personal.phone_number || ''}
                onChange={(e) => handleInputChange('personal_information', 'phone_number', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors['personal_information.phone_number'] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors['personal_information.phone_number'] && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors['personal_information.phone_number']}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={personal.date_of_birth || ''}
                onChange={(e) => handleInputChange('personal_information', 'date_of_birth', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* SSN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Security Number
              <span className="text-xs text-gray-500 ml-1">(Encrypted & Secure)</span>
            </label>
            <input
              type="password"
              value={personal.social_security_number || ''}
              onChange={(e) => handleInputChange('personal_information', 'social_security_number', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="XXX-XX-XXXX"
            />
          </div>

          {/* Driver's License */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver's License Number
              <span className="text-xs text-gray-500 ml-1">(Encrypted & Secure)</span>
            </label>
            <input
              type="text"
              value={personal.drivers_license_number || ''}
              onChange={(e) => handleInputChange('personal_information', 'drivers_license_number', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your driver's license number"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={emergency.name || ''}
                onChange={(e) => handleInputChange('personal_information', 'emergency_contact', e.target.value, 'name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Emergency contact name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
              <input
                type="text"
                value={emergency.relationship || ''}
                onChange={(e) => handleInputChange('personal_information', 'emergency_contact', e.target.value, 'relationship')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mother, Friend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={emergency.phone_number || ''}
                onChange={(e) => handleInputChange('personal_information', 'emergency_contact', e.target.value, 'phone_number')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Emergency contact phone"
              />
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
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>Continue</span>
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderSignatureTerms = () => {
    const signature = applicationData.signature_acknowledgment?.electronic_signature || {};
    const terms = applicationData.signature_acknowledgment?.terms_acknowledgment || {};
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.SIGNATURE_TERMS)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Signature & Terms</h2>
          <p className="text-gray-600">Electronic signature and agreement to terms</p>
        </div>

        {/* Electronic Signature */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <FiFileText className="w-5 h-5 mr-2" />
            Electronic Signature
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name (Electronic Signature)
              </label>
              <input
                type="text"
                value={signature.full_name || ''}
                onChange={(e) => handleInputChange('signature_acknowledgment', 'electronic_signature', e.target.value, 'full_name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your full name as electronic signature"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Signature Date
              </label>
              <input
                type="date"
                value={signature.signature_date || new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('signature_acknowledgment', 'electronic_signature', e.target.value, 'signature_date')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Terms & Acknowledgments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Acknowledgments</h3>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={terms.agree_to_lease_terms || false}
                onChange={(e) => handleInputChange('signature_acknowledgment', 'terms_acknowledgment', e.target.checked, 'agree_to_lease_terms')}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  I agree to the lease terms and conditions <span className="text-red-500">*</span>
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  By checking this box, you agree to abide by all lease terms, rental policies, and property rules.
                </p>
              </div>
            </label>
            {errors['signature_acknowledgment.terms_acknowledgment.agree_to_lease_terms'] && (
              <p className="ml-8 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors['signature_acknowledgment.terms_acknowledgment.agree_to_lease_terms']}
              </p>
            )}

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={terms.consent_to_background_credit_checks || false}
                onChange={(e) => handleInputChange('signature_acknowledgment', 'terms_acknowledgment', e.target.checked, 'consent_to_background_credit_checks')}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  I consent to background and credit checks <span className="text-red-500">*</span>
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Authorization for property management to conduct background, credit, and rental history verification.
                </p>
              </div>
            </label>
            {errors['signature_acknowledgment.terms_acknowledgment.consent_to_background_credit_checks'] && (
              <p className="ml-8 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {errors['signature_acknowledgment.terms_acknowledgment.consent_to_background_credit_checks']}
              </p>
            )}

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={terms.understand_rental_policies || false}
                onChange={(e) => handleInputChange('signature_acknowledgment', 'terms_acknowledgment', e.target.checked, 'understand_rental_policies')}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  I understand the rental policies
                </span>
                <p className="text-xs text-gray-600 mt-1">
                  Acknowledgment of understanding pet policies, parking rules, maintenance procedures, and other property policies.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Legal Notice:</strong> By providing your electronic signature above, you are legally signing this document. 
            You agree that your electronic signature is the legal equivalent of your manual signature. 
            You understand that by completing this application, you are not guaranteed approval for rental.
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <FaChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <div className="flex space-x-3">
            {canSkipStep(currentStep) && (
              <button
                onClick={handleSkip}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <FiSkipForward className="w-4 h-4" />
                <span>Skip</span>
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Continue</span>
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReviewSubmit = () => {
    const personal = applicationData.personal_information || {};
    const residential = applicationData.residential_history || {};
    const employment = applicationData.employment_income || {};
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {renderStepIcon(STEPS.REVIEW_SUBMIT)}
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Review & Submit</h2>
          <p className="text-gray-600">Please review your application before submitting</p>
        </div>

        {/* Application Summary */}
        <div className="space-y-6">
          {/* Personal Information Summary */}
          {personal.full_name && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Name:</strong> {personal.full_name}</div>
                <div><strong>Email:</strong> {personal.email}</div>
                <div><strong>Phone:</strong> {personal.phone_number}</div>
                {personal.date_of_birth && (
                  <div><strong>Date of Birth:</strong> {ApplicationService.formatDate(personal.date_of_birth)}</div>
                )}
              </div>
            </div>
          )}

          {/* Employment Summary */}
          {employment.current_employer?.company_name && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiBriefcase className="w-5 h-5 mr-2 text-green-600" />
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Company:</strong> {employment.current_employer.company_name}</div>
                <div><strong>Position:</strong> {employment.current_employer.job_title}</div>
                {employment.current_employer.monthly_income && (
                  <div><strong>Monthly Income:</strong> ${employment.current_employer.monthly_income.toLocaleString()}</div>
                )}
              </div>
            </div>
          )}

          {/* Property Information */}
          {currentProperty && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiHome className="w-5 h-5 mr-2 text-purple-600" />
                Property Applied For
              </h3>
              <div className="flex items-start space-x-4">
                <img
                  src={currentProperty.media?.[0]?.url || '/Home1.jpg'}
                  alt={currentProperty.title}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => { e.target.src = '/Home1.jpg'; }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{currentProperty.title}</h4>
                  <p className="text-sm text-gray-600">{currentProperty.address}, {currentProperty.city}, {currentProperty.state}</p>
                  <p className="text-sm font-semibold text-blue-600">${currentProperty.price?.toLocaleString()}/mo</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Submit?</h3>
          <p className="text-sm text-blue-800 mb-4">
            By submitting this application, you confirm that all information provided is accurate and complete.
            You will receive a confirmation email after submission.
          </p>
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
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 bg-green-400 rounded animate-pulse"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <FiCheck className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your rental application has been submitted successfully.
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
              <span>Our team will review your application within 2-3 business days</span>
            </div>
            <div className="flex items-start space-x-2">
              <FiCheck className="w-4 h-4 mt-0.5 text-green-600" />
              <span>We'll contact you with updates or requests for additional information</span>
            </div>
          </div>
          
          {submissionResult.application_id && (
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-xs text-gray-600">Application Reference ID:</p>
              <p className="font-mono text-sm text-gray-900">{submissionResult.application_id}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={propertyId ? `/properties/${propertyId}` : '/properties'}
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
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="w-48 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
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
          <div className="flex justify-end">
            <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
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
            to={propertyId ? `/properties/${propertyId}` : '/properties'}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Property
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep !== STEPS.CONFIRMATION && renderProgressBar()}
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === STEPS.PROPERTY_INFO && renderPropertyInfo()}
          {currentStep === STEPS.PERSONAL_INFO && renderPersonalInfo()}
          {currentStep === STEPS.RESIDENTIAL_HISTORY && renderResidentialHistory()}
          {currentStep === STEPS.EMPLOYMENT_INCOME && renderEmploymentIncome()}
          {currentStep === STEPS.CREDIT_BACKGROUND && renderCreditBackground()}
          {currentStep === STEPS.REFERENCES && renderReferences()}
          {currentStep === STEPS.ADDITIONAL_INFO && renderAdditionalInfo()}
          {currentStep === STEPS.SIGNATURE_TERMS && renderSignatureTerms()}
          {currentStep === STEPS.REVIEW_SUBMIT && renderReviewSubmit()}
          {currentStep === STEPS.CONFIRMATION && renderConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;