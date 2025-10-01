import React from 'react';
import {  FiUser, FiCheck, FiX, FiPhone, FiMail } from 'react-icons/fi';
import {FaRobot} from 'react-icons/fa';
import { BiRefresh } from 'react-icons/bi';
import PropertySearchResults from './PropertySearchResults';
import PropertyBrowseResults from './PropertyBrowseResults';
import SatisfactionSurvey from './SatisfactionSurvey';

const ChatMessage = ({ message, onOptionClick, onSatisfactionResponse, onPropertySelect }) => {
  const isBot = message.type === 'bot';
  
  const formatMessage = (content) => {
    // Handle markdown-style formatting
    console.log('Formatting message content:', content); // Debug log
    // Use completion_message as fallback if content is undefined
    const textContent = content || message.completion_message || '';
    return textContent?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  const renderMessageContent = () => {
    // Handle different input types and special content
    switch (message.inputType) {
      case 'property_results':
      case 'property_search_results':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            {message.properties && message.properties.length > 0 && (
              <PropertySearchResults 
                properties={message.properties}
                onPropertySelect={onPropertySelect}
                searchKeyword={message.searchKeyword}
                additionalOptions={message.additionalOptions}
              />
            )}
          </div>
        );

      case 'property_browse':
        
      case 'property_search_no_results':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            {message.properties && message.properties.length > 0 && (
              <PropertyBrowseResults 
                properties={message.properties}
                onPropertySelect={onPropertySelect}
                additionalOptions={message.additionalOptions}
              />
            )}
          </div>
        );

        
      case 'property_selection':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            {message.properties && message.properties.length > 0 && (
              <PropertyBrowseResults 
                properties={message.properties}
                onPropertySelect={onPropertySelect}
                additionalOptions={message.additionalOptions}
              />
            )}
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content || message.completion_message) }}
            />
            {message.options.length>0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onOptionClick(option, true)}
                    className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm border border-gray-200 flex items-center space-x-1"
                  >
                    {option === "Yes, I'm satisfied" && <FiCheck className="w-3 h-3" />}
                    {option === "No, I need more help" && <FiX className="w-3 h-3" />}
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            ):(<div className="flex flex-wrap gap-2 mt-3">
                <p className='text-gray-600'>{message.completion_message || 'No options available'}</p>
            </div>
            )}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <FiMail className="w-4 h-4" />
              <span>Please provide a valid email address</span>
            </div>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <FiPhone className="w-4 h-4" />
              <span>Please provide a valid phone number</span>
            </div>
          </div>
        );

      case 'no_results':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800 p-3 bg-yellow-50 border border-yellow-200 rounded-lg" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            {message.options && (
              <div className="flex flex-wrap gap-2">
                {message.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onOptionClick(option, true)}
                    className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm border border-yellow-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'thank_you_message':
        return (
          <div className="space-y-3">
            <div className="text-gray-800 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
            </div>
            {message.contactSubmitted && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Your inquiry has been submitted successfully. Our team will contact you soon!
              </div>
            )}
          </div>
        );

      case 'info_response':
        return (
          <div className="space-y-3">
            <div 
              className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            {message.options && (
              <div className="flex flex-wrap gap-2">
                {message.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onOptionClick(option, true)}
                    className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm border border-gray-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 'completion':
        return (
          <div className="space-y-3">
            <div className="text-gray-800 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
              <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2"
              >
                <BiRefresh className="w-4 h-4" />
                <span>Start New Chat</span>
              </button>
            </div>
          </div>
        );

      default:
        // Regular text message
        return (
          <div className="space-y-3">
            <div 
              className="text-white-800" 
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
            {message.options && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onOptionClick(option, true)}
                    className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm border border-gray-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`flex items-start space-x-2 ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isBot 
          ? 'bg-gray-100 text-gray-600' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isBot ? <FaRobot className="w-4 h-4" /> : <FiUser className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className={`max-w-xs ${isBot ? '' : 'text-right'}`}>
        <div className={`rounded-lg p-3 ${
          isBot 
            ? 'bg-white border border-gray-200 shadow-sm' 
            : 'bg-gray-500 text-white'
        }`}>
          {renderMessageContent()}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 mt-1 ${isBot ? '' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;