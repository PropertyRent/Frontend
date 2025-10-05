import React, { useState, useEffect, useRef } from 'react';
import { 
  FiMessageCircle, 
  FiX, 
  FiSend, 
  FiUser, 
  FiMinimize2,
  FiMaximize2 
} from 'react-icons/fi';
import {FaRobot} from 'react-icons/fa';
import { BiRefresh } from 'react-icons/bi';
import toast from 'react-hot-toast';
import ChatbotService from '../../services/chatbotService';
import ChatMessage from './ChatMessage';
import PropertySearchResults from './PropertySearchResults';
import PropertyBrowseResults from './PropertyBrowseResults';
import LoadingDots from './LoadingDots';

const ChatbotWidget = () => {
  // Widget state
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [conversationComplete, setConversationComplete] = useState(false);
  
  // UI state
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize chat when widget opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat(sessionId);
    }
  }, [isOpen]);

  const initializeChat = async (sid) => {
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      const response = await ChatbotService.startChat(sid);
      
      if (response.success) {
        setSessionId(response.data.session_id);
        // console.log('Chat session started:', response.data);
        
        // Simulate typing delay
        setTimeout(() => {
          setMessages([{
            id: Date.now(),
            type: 'bot',
            content: response.data.question || response.data.completion_message,
            options: response.data.options,
            completion_message: response.data.completion_message,
            inputType: response.data.input_type,
            stepNumber: response.data.step_number,
            timestamp: new Date(),
            flowType: response.data.flow_type
          }]);
          setIsTyping(false);
        }, 1000);
      } else {
        throw new Error(response.message || 'Failed to start chat');
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Failed to start chat. Please try again.');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message, isChoice = false) => {
    if (!message.trim() && !isChoice) return;
    if (conversationComplete) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await ChatbotService.sendResponse(sessionId, message);
      
      if (response.success) {
        // Handle different response types
        setTimeout(() => {
          const botMessage = {
            id: Date.now() + 1,
            type: 'bot',
            content: response.data.question || response.data.completion_message,
            completion_message: response.data.completion_message,
            options: response.data.options,
            inputType: response.data.input_type,
            stepNumber: response.data.step_number,
            timestamp: new Date(),
            flowType: response.data.flow_type,
            properties: response.data.properties,
            isFinal: response.data.is_final,
            conversationCompleted: response.data.conversation_completed,
            contactSubmitted: response.data.contact_submitted,
            searchKeyword: response.data.search_keyword,
            selectedPropertyId: response.data.selected_property_id,
            additionalOptions: response.data.additional_options,
            restart: response.data.restart
          };

          setMessages(prev => [...prev, botMessage]);
          setCurrentStep(response.data.step_number);
          setIsTyping(false);

          // Handle conversation completion
          if (response.data.conversation_completed || response.data.is_final) {
            setConversationComplete(true);
          }

          // Handle restart flow
          if (response.data.restart) {
            setConversationComplete(false);
            setCurrentStep(0);
          }
        }, Math.random() * 1000 + 500); // Random typing delay
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSatisfactionResponse = async (isSatisfied, feedback = '') => {
    const satisfactionText = isSatisfied ? "Yes, I'm satisfied" : "No, I need more help";
    
    // Add user response
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: satisfactionText + (feedback ? ` - ${feedback}` : ''),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await ChatbotService.submitSatisfaction(sessionId, isSatisfied, feedback);
      
      if (response.success) {
        setTimeout(() => {
          const botMessage = {
            id: Date.now() + 1,
            type: 'bot',
            content: response.message,
            timestamp: new Date(),
            conversationCompleted: response.data.conversation_completed,
            escalated: response.data.escalated
          };

          setMessages(prev => [...prev, botMessage]);
          setConversationComplete(true);
          setIsTyping(false);

          if (response.data.escalated) {
            toast.success('We\'ll have our team contact you soon!');
          } else {
            toast.success('Thank you for your feedback!');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error submitting satisfaction:', error);
      toast.error('Failed to submit response. Please try again.');
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(userInput);
    }
  };

  const restartChat = () => {
    setMessages([]);
    setSessionId(null);
    setCurrentStep(0);
    setConversationComplete(false);
    setUserInput('');
    setIsTyping(false);
    initializeChat(null);
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Get the last bot message for input handling
  const lastBotMessage = messages.filter(msg => msg.type === 'bot').pop();
  const hasOptions = lastBotMessage?.options ? lastBotMessage.options.length > 0 : false;

  console.log("Last Bot Message:", lastBotMessage);
  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed bottom-22 right-8 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
          isMinimized ? 'h-16 w-80' : 'min-h-96 w-80 md:w-96 md:min-h-[500px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-600 to-gray-400 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <FaRobot className="w-5 h-5" />
              <h3 className="font-semibold">Property Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMinimize}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                {isMinimized ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={restartChat}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Restart Chat"
              >
                <BiRefresh className="w-4 h-4" />
              </button>
              <button
                onClick={toggleWidget}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 md:h-96">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onOptionClick={sendMessage}
                    onSatisfactionResponse={handleSatisfactionResponse}
                    onPropertySelect={sendMessage}
                  />
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaRobot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <LoadingDots />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {!conversationComplete && !isLoading && (
                <div className="p-4 border-t border-gray-200">
                  {!hasOptions && (
                    // Show text input
                    <div className="flex items-center space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                      <button
                        onClick={() => sendMessage(userInput)}
                        disabled={!userInput.trim() || isLoading}
                        className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiSend className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          className="fixed bottom-6 right-24 z-50 w-14 h-14 bg-gray-700 border border-white text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group cursor-pointer"
        >
          <FiMessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}
    </>
  );
};

export default ChatbotWidget;