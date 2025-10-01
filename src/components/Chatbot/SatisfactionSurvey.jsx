import React, { useState } from 'react';
import { FiThumbsUp, FiThumbsDown, FiMessageSquare, FiSend } from 'react-icons/fi';

const SatisfactionSurvey = ({ onSatisfactionResponse, sessionId }) => {
  const [selectedSatisfaction, setSelectedSatisfaction] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSatisfactionClick = (isSatisfied) => {
    setSelectedSatisfaction(isSatisfied);
    if (!isSatisfied) {
      setShowFeedback(true);
    } else {
      // If satisfied, submit immediately without feedback
      onSatisfactionResponse(true, '');
    }
  };

  const handleSubmitFeedback = () => {
    onSatisfactionResponse(selectedSatisfaction, feedback);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitFeedback();
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-2">How was your experience?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please let us know if we were able to help you today.
        </p>
      </div>

      {/* Satisfaction Buttons */}
      {selectedSatisfaction === null && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleSatisfactionClick(true)}
            className="flex flex-col items-center space-y-2 p-4 bg-white border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
          >
            <FiThumbsUp className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-700">Yes, I'm satisfied</span>
          </button>

          <button
            onClick={() => handleSatisfactionClick(false)}
            className="flex flex-col items-center space-y-2 p-4 bg-white border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all group"
          >
            <FiThumbsDown className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-red-700">No, I need more help</span>
          </button>
        </div>
      )}

      {/* Feedback Input */}
      {showFeedback && selectedSatisfaction === false && (
        <div className="space-y-3 animate-fadeIn">
          <div className="text-center">
            <FiMessageSquare className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-gray-700 mb-3">
              We're sorry we couldn't fully help you. Please tell us what you need assistance with:
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Please describe what you need help with or what went wrong..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows="3"
              maxLength="500"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {feedback.length}/500 characters
              </span>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowFeedback(false);
                    setSelectedSatisfaction(null);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmitFeedback}
                  disabled={!feedback.trim()}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center space-x-1"
                >
                  <FiSend className="w-3 h-3" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded border border-orange-200">
            💡 Our team will review your feedback and contact you within 24 hours to provide additional assistance.
          </div>
        </div>
      )}

      {/* Confirmation */}
      {selectedSatisfaction === true && (
        <div className="text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiThumbsUp className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-medium text-green-800 mb-1">Thank you!</h3>
          <p className="text-sm text-green-700">
            We're glad we could help you today. 😊
          </p>
        </div>
      )}
    </div>
  );
};

export default SatisfactionSurvey;