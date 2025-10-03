import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiFileText, 
  FiSend, 
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
  FiLoader,
  FiCalendar,
  FiHash,
  FiToggleLeft,
  FiToggleRight,
  FiMessageSquare
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import ScreeningService from '../services/screeningService';

const ScreeningForm = () => {
  const navigate = useNavigate();
  
  // Form state
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState(ScreeningService.createEmptyResponse());
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await ScreeningService.getActiveQuestions();
      if (response.success) {
        setQuestions(response.data);
        // Initialize answers object
        const initialAnswers = {};
        response.data.forEach(question => {
          // Initialize yesno questions with null, others with empty string
          initialAnswers[question.id] = question.question_type === 'yesno' ? null : '';
        });
        setAnswers(initialAnswers);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load screening questions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));

    // Clear error for this answer
    if (errors[`answer_${questionId}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`answer_${questionId}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate basic info
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 characters';
    }

    // Validate required answers
    questions.forEach(question => {
      if (question.is_required) {
        const answer = answers[question.id];
        if (question.question_type === 'yesno') {
          // For yesno questions, check if answer is null/undefined
          if (answer === null || answer === undefined) {
            newErrors[`answer_${question.id}`] = 'This question is required';
          }
        } else {
          // For other question types, check if empty or whitespace
          if (!answer || (typeof answer === 'string' && !answer.trim())) {
            newErrors[`answer_${question.id}`] = 'This question is required';
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare answers array
      const answersArray = questions.map(question => {
        const answer = answers[question.id];
        return ScreeningService.createAnswerForQuestion(question, answer);
      }).filter(answer => {
        // Only include answers that have values
        return answer.answer_text || 
               answer.answer_number !== null ||
               answer.answer_date || 
               answer.answer_yesno !== null;
      });

      const responseData = {
        ...formData,
        answers: answersArray
      };

      const response = await ScreeningService.submitResponse(responseData);

      if (response.success) {
        setSubmissionResult(response.data);
        setSubmitted(true);
        toast.success('Screening form submitted successfully!');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit screening form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionInput = (question) => {
    const value = answers[question.id] || '';
    const hasError = errors[`answer_${question.id}`];

    switch (question.question_type) {
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={value}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  hasError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={question.placeholder_text || 'Enter your answer'}
              />
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <FiHash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={value}
                onChange={(e) => handleAnswerChange(question.id, e.target.value ? parseInt(e.target.value) : '')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  hasError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={question.placeholder_text || 'Enter a number'}
              />
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={value}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  hasError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'yesno':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question_text}
              {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value="true"
                  checked={value === true}
                  onChange={(e) => handleAnswerChange(question.id, true)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question_${question.id}`}
                  value="false"
                  checked={!value}
                  onChange={(e) => handleAnswerChange(question.id, false)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
              <div className="w-48 h-5 bg-gray-200 rounded mx-auto animate-pulse"></div>
            </div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-48 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              to="/properties"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your screening form has been submitted successfully.
            </p>

            {submissionResult?.recommendations && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Property Recommendations</h3>
                <p className="text-blue-800">
                  {submissionResult.recommendations.message}
                </p>
                {submissionResult.recommendations.generated && submissionResult.recommendations.property_count > 0 && (
                  <div className="mt-4">
                    <Link
                      to="/properties"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Recommended Properties
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <FiCheck className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>We will review your responses within 24-48 hours</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FiCheck className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>Our team will contact you with suitable property matches</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FiCheck className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>You will receive updates via email or phone</span>
                </div>
              </div>
              
              {submissionResult?.response_id && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-xs text-gray-600">Reference ID:</p>
                  <p className="font-mono text-sm text-gray-900">{submissionResult.response_id}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/screening"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Submit Another Response
              </Link>
              <Link
                to="/properties"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to="/properties"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pre-Screening Questionnaire</h1>
            <p className="text-gray-600">
              Help us find the perfect property for you by answering a few questions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional information or special requests..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Screening Questions */}
            {questions.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Screening Questions</h2>
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        Question {index + 1} of {questions.length}
                      </span>
                    </div>
                    {renderQuestionInput(question)}
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Submit?</h3>
              <p className="text-sm text-blue-800 mb-4">
                By submitting this form, you confirm that all information provided is accurate and complete.
                We will use this information to find the best property matches for you.
              </p>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      <span>Submit Screening Form</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScreeningForm;