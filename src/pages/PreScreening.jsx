import React, { useState } from "react";
import { FiUser, FiMail, FiUsers, FiCalendar, FiBriefcase, FiDollarSign, FiAlertCircle, FiMessageSquare } from "react-icons/fi";

export default function PreScreeningPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    peopleCount: "",
    pets: "",
    moveInDate: "",
    jobDuration: "",
    rentDepositIssues: "",
    collectionsHistory: "",
    optionalMessage: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.peopleCount.trim()) {
      newErrors.peopleCount = "Number of people is required";
    } else if (isNaN(formData.peopleCount) || parseInt(formData.peopleCount) < 1) {
      newErrors.peopleCount = "Please enter a valid number";
    }
    
    if (!formData.moveInDate) {
      newErrors.moveInDate = "Move-in date is required";
    }
    
    if (!formData.jobDuration.trim()) {
      newErrors.jobDuration = "Job duration is required";
    }
    
    if (!formData.rentDepositIssues.trim()) {
      newErrors.rentDepositIssues = "Please answer this question";
    }
    
    if (!formData.collectionsHistory.trim()) {
      newErrors.collectionsHistory = "Please select an option";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        success: true,
        message: "Thank you! Your pre-screening form has been submitted successfully. We'll contact you within 24-48 hours to schedule a call."
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        peopleCount: "",
        pets: "",
        moveInDate: "",
        jobDuration: "",
        rentDepositIssues: "",
        collectionsHistory: "",
        optionalMessage: ""
      });
      
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "There was an error submitting your form. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      peopleCount: "",
      pets: "",
      moveInDate: "",
      jobDuration: "",
      rentDepositIssues: "",
      collectionsHistory: "",
      optionalMessage: ""
    });
    setErrors({});
    setSubmitStatus({ success: null, message: "" });
  };

  const inputClasses = "w-full px-4 py-3 border border-[var(--color-tan)]/50 rounded-lg bg-white text-[var(--color-darkest)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all";
  const labelClasses = "block text-sm font-medium text-[var(--color-darkest)] mb-2";
  const errorClasses = "mt-1 text-sm text-red-600";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-darkest)] mb-4">
            PRE-SCREENING QUESTION FORM
          </h1>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            Please fill out this form and I will arrange a time for a call.
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className="mr-2">
                {submitStatus.success ? '✓' : '⚠️'}
              </div>
              <p>{submitStatus.message}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--color-tan)]/20">
          {/* Row 1: Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className={labelClasses}>
                <FiUser className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={inputClasses}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className={errorClasses}>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClasses}>
                <FiMail className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={inputClasses}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className={errorClasses}>{errors.email}</p>}
            </div>

            {/* Number of People */}
            <div>
              <label htmlFor="peopleCount" className={labelClasses}>
                <FiUsers className="inline mr-2" />
                How many people will be moving in?
              </label>
              <input
                type="number"
                id="peopleCount"
                name="peopleCount"
                value={formData.peopleCount}
                onChange={handleInputChange}
                placeholder="Number of people"
                min="1"
                className={inputClasses}
                aria-invalid={!!errors.peopleCount}
              />
              {errors.peopleCount && <p className={errorClasses}>{errors.peopleCount}</p>}
            </div>
          </div>

          {/* Row 2: Pet Information */}
          <div className="mb-6">
            <label htmlFor="pets" className={labelClasses}>
              Do you have any pets? If so, what are the breeds and how many?
            </label>
            <textarea
              id="pets"
              name="pets"
              value={formData.pets}
              onChange={handleInputChange}
              placeholder="Please describe your pets (breed, number, etc.) or write 'No pets'"
              rows={3}
              className={inputClasses}
            />
          </div>

          {/* Row 3: Move-in Date and Job Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Move-in Date */}
            <div>
              <label htmlFor="moveInDate" className={labelClasses}>
                <FiCalendar className="inline mr-2" />
                How soon are you looking to move in?
              </label>
              <input
                type="date"
                id="moveInDate"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleInputChange}
                className={inputClasses}
                aria-invalid={!!errors.moveInDate}
              />
              {errors.moveInDate && <p className={errorClasses}>{errors.moveInDate}</p>}
            </div>

            {/* Job Duration */}
            <div>
              <label htmlFor="jobDuration" className={labelClasses}>
                <FiBriefcase className="inline mr-2" />
                How long have you been at your current job?
              </label>
              <input
                type="text"
                id="jobDuration"
                name="jobDuration"
                value={formData.jobDuration}
                onChange={handleInputChange}
                placeholder="e.g., 2 years, 6 months"
                className={inputClasses}
                aria-invalid={!!errors.jobDuration}
              />
              {errors.jobDuration && <p className={errorClasses}>{errors.jobDuration}</p>}
            </div>
          </div>

          {/* Row 4: Financial Questions */}
          <div className="mb-6">
            <label htmlFor="rentDepositIssues" className={labelClasses}>
              <FiDollarSign className="inline mr-2" />
              Will there be any issues making the 1st month rent + deposit before move in?
            </label>
            <textarea
              id="rentDepositIssues"
              name="rentDepositIssues"
              value={formData.rentDepositIssues}
              onChange={handleInputChange}
              placeholder="Please explain any potential issues or write 'No issues'"
              rows={3}
              className={inputClasses}
              aria-invalid={!!errors.rentDepositIssues}
            />
            {errors.rentDepositIssues && <p className={errorClasses}>{errors.rentDepositIssues}</p>}
          </div>

          {/* Row 5: Collections History */}
          <div className="mb-6">
            <label htmlFor="collectionsHistory" className={labelClasses}>
              <FiAlertCircle className="inline mr-2" />
              Have you ever been sent to collections for not paying your bills?
            </label>
            <select
              id="collectionsHistory"
              name="collectionsHistory"
              value={formData.collectionsHistory}
              onChange={handleInputChange}
              className={inputClasses}
              aria-invalid={!!errors.collectionsHistory}
            >
              <option value="">Please select an option</option>
              <option value="no">No, never</option>
              <option value="yes-resolved">Yes, but it's been resolved</option>
              <option value="yes-current">Yes, and it's still ongoing</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.collectionsHistory && <p className={errorClasses}>{errors.collectionsHistory}</p>}
          </div>

          {/* Row 6: Optional Message */}
          <div className="mb-8">
            <label htmlFor="optionalMessage" className={labelClasses}>
              <FiMessageSquare className="inline mr-2" />
              Optional Message
            </label>
            <textarea
              id="optionalMessage"
              name="optionalMessage"
              value={formData.optionalMessage}
              onChange={handleInputChange}
              placeholder="Any additional information you'd like to share..."
              rows={4}
              className={inputClasses}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white font-semibold rounded-full transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-white border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-light)] font-semibold rounded-full transition-colors duration-200"
            >
              Reset Form
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            Your information is secure and will only be used for rental application purposes.
            <br />
            We typically respond within 24-48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}