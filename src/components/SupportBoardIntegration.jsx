import { useEffect, useRef, useCallback } from 'react';
import { useChatbotActions } from '../hooks/useChatbotActions';

/**
 * Support Board Integration Component
 * Handles initialization and message processing for Support Board chatbot
 */
const SupportBoardIntegration = () => {
  const { handleChatbotAction } = useChatbotActions();
  const initializationAttempts = useRef(0);
  const maxAttempts = 10;

  // Memoized message handler to prevent recreation on every render
  const handleMessage = useCallback(async (message, conversation, event) => {
    try {
      console.log('Support Board message received:', message, conversation, event);
      
      // Extract message text from different possible formats
      const messageText = message?.message || message?.text || message?.content || message;
      
      if (!messageText || typeof messageText !== 'string') {
        console.log('No valid message text found');
        return;
      }
      
      // Check if the message contains JSON action
      const jsonMatch = messageText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        console.log('JSON action detected:', jsonMatch[0]);
        
        // Extract and process JSON action
        const jsonString = jsonMatch[0];
        const response = await handleChatbotAction(jsonString);
        
        console.log('Chatbot action response:', response);
        
        // Send processed response back to chatbot
        if (response) {
          const supportBoard = window._supportBoardInstance || window.SBF || window.SB || window.supportBoard || window.chat;
          
          if (supportBoard) {
            setTimeout(() => {
              // Try different send methods
              if (typeof supportBoard.send === 'function') {
                supportBoard.send({
                  message: response,
                  attachments: [],
                  conversation_id: conversation?.id,
                  user_type: 'bot'
                });
              } else if (typeof supportBoard.sendMessage === 'function') {
                supportBoard.sendMessage(response);
              } else if (typeof supportBoard.reply === 'function') {
                supportBoard.reply(response);
              } else {
                console.log('No send method found on Support Board instance');
              }
            }, 500);
          }
        }
      } else {
        // Handle regular messages - could implement basic responses here
        console.log('Regular message (no JSON action):', messageText);
      }
    } catch (error) {
      console.error('Error processing Support Board message:', error);
      
      // Send error response
      const supportBoard = window._supportBoardInstance || window.SBF || window.SB || window.supportBoard || window.chat;
      if (supportBoard && typeof supportBoard.send === 'function') {
        setTimeout(() => {
          supportBoard.send({
            message: 'I apologize, but I encountered an error processing your request. Please try again or contact us directly at (315) 834-0010.',
            attachments: [],
            conversation_id: conversation?.id,
            user_type: 'bot'
          });
        }, 500);
      }
    }
  }, [handleChatbotAction]);

  // Memoized initialization function
  const initSupportBoard = useCallback(() => {
    // Check for different possible global variables that Support Board might create
    const supportBoard = window.SBF || window.SB || window.supportBoard || window.chat;
    
    if (supportBoard) {
      try {
        console.log('Support Board object found:', supportBoard);
        console.log('Initializing Support Board chatbot...');
        
        // Configure Support Board settings
        const config = {
          // Basic configuration
          department: 'GMP Rentals Support',
          welcome_message: 'Hello! 👋 Welcome to GMP Rentals.\n\nI can help you with:\n• Finding available properties\n• Submitting rental applications\n• Answering questions about our services\n• Scheduling property visits\n\nHow can I assist you today?',
          
          // Appearance settings
          chat_color: '#2563eb',
          chat_title: 'GMP Rentals Assistant',
          
          // Behavior settings
          auto_open: false,
          disable_offline: false,
          sound: true,
          notifications: true
        };

        // Try different initialization methods
        if (typeof supportBoard.init === 'function') {
          supportBoard.init(config);
        } else if (typeof supportBoard.initialize === 'function') {
          supportBoard.initialize(config);
        } else if (typeof supportBoard.config === 'function') {
          supportBoard.config(config);
        } else {
          // Try to set configuration directly
          Object.assign(supportBoard, config);
        }

        // Set up message handler
        if (typeof supportBoard.on === 'function') {
          supportBoard.on('message', handleMessage);
        } else if (supportBoard.onMessage) {
          supportBoard.onMessage = handleMessage;
        }
        
        // Set up ready handler
        const setupReadyHandler = () => {
          console.log('Support Board chatbot initialized successfully');
          
          // Add custom quick replies for common property queries
          const quickReplies = [
            '🏠 Show available properties',
            '📅 Schedule a property visit',
            '📝 How to apply for a property',
            '❓ Rental requirements',
            '📞 Contact property manager'
          ];
          
          // Set up quick replies if supported
          if (typeof supportBoard.setQuickReplies === 'function') {
            supportBoard.setQuickReplies(quickReplies);
          }
        };

        if (typeof supportBoard.onReady === 'function') {
          supportBoard.onReady(setupReadyHandler);
        } else if (typeof supportBoard.ready === 'function') {
          supportBoard.ready(setupReadyHandler);
        } else {
          // Call setup directly if no ready handler
          setTimeout(setupReadyHandler, 1000);
        }

        // Store reference for cleanup
        window._supportBoardInstance = supportBoard;
        
        console.log('Support Board configuration applied');
        return true;
        
      } catch (error) {
        console.error('Error initializing Support Board:', error);
        return false;
      }
    } else {
      initializationAttempts.current++;
      if (initializationAttempts.current < maxAttempts) {
        console.log(`Support Board not ready, attempt ${initializationAttempts.current}/${maxAttempts}`);
        setTimeout(initSupportBoard, 1000);
      } else {
        console.warn('Support Board initialization failed after maximum attempts');
      }
      return false;
    }
  }, [handleMessage]);

  useEffect(() => {
    // Reset attempt counter
    initializationAttempts.current = 0;
    
    // Check if Support Board script is already loaded
    if (window.SB) {
      initSupportBoard();
    } else {
      // Wait for script to load
      const checkScript = () => {
        const scriptElement = document.getElementById('chat-init');
        if (scriptElement) {
          if (scriptElement.readyState === 'complete' || scriptElement.readyState === 'loaded') {
            initSupportBoard();
          } else {
            scriptElement.onload = initSupportBoard;
            scriptElement.onerror = () => {
              console.error('Failed to load Support Board script');
            };
          }
        } else {
          // Script element not found, try again after delay
          setTimeout(checkScript, 500);
        }
      };
      
      checkScript();
    }

    // Cleanup function
    return () => {
      const supportBoard = window._supportBoardInstance || window.SBF || window.SB || window.supportBoard || window.chat;
      if (supportBoard) {
        try {
          if (typeof supportBoard.close === 'function') {
            supportBoard.close();
          }
          if (typeof supportBoard.destroy === 'function') {
            supportBoard.destroy();
          }
          if (typeof supportBoard.hide === 'function') {
            supportBoard.hide();
          }
        } catch (error) {
          console.error('Error cleaning up Support Board:', error);
        }
      }
      window._supportBoardInstance = null;
    };
  }, [initSupportBoard]);

  // This component doesn't render anything visible
  // The Support Board widget is handled by the external script
  return null;
};

export default SupportBoardIntegration;