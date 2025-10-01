import React, { useState } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiMessageCircle, FiBot, FiUser } from 'react-icons/fi';
import ChatbotWidget from '../Chatbot/ChatbotWidget';

const ChatbotDemo = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Welcome Message",
      description: "The chatbot greets users with multiple service options",
      preview: {
        type: 'bot',
        content: "Hi! I'm your property assistant. How can I help you today?",
        options: [
          "Find a property to rent",
          "Ask about a specific property", 
          "Schedule a property visit",
          "Report an issue",
          "Give feedback"
        ]
      }
    },
    {
      title: "Property Search Flow",
      description: "Collects user preferences for property search",
      preview: {
        type: 'bot',
        content: "What type of property are you looking for?",
        options: ["Apartment", "House", "Studio", "Villa", "Any"]
      }
    },
    {
      title: "Dynamic Results",
      description: "Shows matching properties based on user criteria",
      preview: {
        type: 'bot',
        content: "Great! I found 5 properties matching your criteria:",
        properties: [
          { id: 1, title: "Modern Downtown Apartment", location: "New York, NY", price: "₹45,000/month" },
          { id: 2, title: "Cozy Studio Near Metro", location: "New York, NY", price: "₹25,000/month" }
        ]
      }
    },
    {
      title: "Satisfaction Survey",
      description: "Collects feedback and handles escalations",
      preview: {
        type: 'bot',
        content: "Are you satisfied with the assistance provided?",
        options: ["Yes, I'm satisfied", "No, I need more help"]
      }
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  const resetDemo = () => {
    setCurrentStep(0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <FiBot className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Property Assistant Chatbot</h1>
        </div>
        <p className="text-lg text-gray-600">
          Intelligent conversational AI for property rentals with multi-flow support
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              🏠
            </div>
            <h3 className="font-semibold text-gray-900">Property Search</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Advanced filtering by type, location, budget, bedrooms, pets, and amenities
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              💬
            </div>
            <h3 className="font-semibold text-gray-900">Rent Inquiries</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Property-specific information, pricing, amenities, and contact collection
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              📅
            </div>
            <h3 className="font-semibold text-gray-900">Visit Scheduling</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Schedule property visits with date/time selection and contact details
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              🐛
            </div>
            <h3 className="font-semibold text-gray-900">Bug Reports</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Technical issue reporting with categorization and automatic escalation
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              💭
            </div>
            <h3 className="font-semibold text-gray-900">Feedback</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Service feedback collection with rating and improvement suggestions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              📊
            </div>
            <h3 className="font-semibold text-gray-900">Admin Dashboard</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Conversation analytics, escalation management, and performance metrics
          </p>
        </div>
      </div>

      {/* Demo Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Live Demo</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                showDemo 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {showDemo ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
              <span>{showDemo ? 'Hide Demo' : 'Show Live Demo'}</span>
            </button>
          </div>
        </div>

        {!showDemo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flow Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Conversation Flow Preview</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevStep}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    ←
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentStep + 1} / {demoSteps.length}
                  </span>
                  <button
                    onClick={nextStep}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    →
                  </button>
                  <button
                    onClick={resetDemo}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <FiRotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {demoSteps[currentStep].title}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {demoSteps[currentStep].description}
                </p>

                {/* Message Preview */}
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiBot className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-gray-800 mb-3">
                          {demoSteps[currentStep].preview.content}
                        </p>
                        
                        {demoSteps[currentStep].preview.options && (
                          <div className="flex flex-wrap gap-2">
                            {demoSteps[currentStep].preview.options.map((option, index) => (
                              <button
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200 hover:bg-blue-100 transition-colors"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}

                        {demoSteps[currentStep].preview.properties && (
                          <div className="space-y-2 mt-3">
                            {demoSteps[currentStep].preview.properties.map((property, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-2 text-sm">
                                <div className="font-medium text-gray-900">{property.title}</div>
                                <div className="text-gray-600">{property.location}</div>
                                <div className="text-green-600 font-medium">{property.price}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Features */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Technical Features</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Session Management</h4>
                    <p className="text-sm text-gray-600">UUID-based session tracking with conversation state persistence</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Dynamic Flow Routing</h4>
                    <p className="text-sm text-gray-600">Intelligent flow determination based on user responses</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Response Time Tracking</h4>
                    <p className="text-sm text-gray-600">Performance analytics with user engagement metrics</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Escalation System</h4>
                    <p className="text-sm text-gray-600">Automatic admin notifications for unsatisfied users</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Property Integration</h4>
                    <p className="text-sm text-gray-600">Real-time property search with advanced filtering</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-600">SMTP integration for admin alerts and user confirmations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDemo && (
          <div className="text-center py-8">
            <FiMessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Live Chatbot Demo is Active!
            </h3>
            <p className="text-gray-600 mb-4">
              Look for the chatbot widget in the bottom-right corner of your screen.
            </p>
            <p className="text-sm text-gray-500">
              Try different conversation flows to see the full functionality.
            </p>
          </div>
        )}
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Integration</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Public Endpoints</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">POST</span>
                <span className="font-mono text-gray-700">/api/chatbot/start</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">POST</span>
                <span className="font-mono text-gray-700">/api/chatbot/respond</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-mono">POST</span>
                <span className="font-mono text-gray-700">/api/chatbot/satisfaction</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Admin Endpoints</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">GET</span>
                <span className="font-mono text-gray-700">/api/admin/chatbot/conversations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">GET</span>
                <span className="font-mono text-gray-700">/api/admin/chatbot/stats</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">GET</span>
                <span className="font-mono text-gray-700">/api/admin/chatbot/conversations/{id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotDemo;