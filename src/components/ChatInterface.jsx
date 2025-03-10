import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/apiService';
import Message from './Message';
import PromptModifiers from './PromptModifiers';
import FileUpload from './FileUpload';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promptInstructions, setPromptInstructions] = useState([]);
  const [conversationId] = useState(Date.now().toString());
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError('');
    
    try {
      const response = await sendMessage(userMessage.content, conversationId, promptInstructions);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptChange = (instructions) => {
    setPromptInstructions(instructions);
  };

  const handleFileUpload = (response) => {
    // Add a system message about the upload
    const systemMessage = {
      role: 'system',
      content: `Document uploaded successfully: ${response.filename || 'File'}. You can now ask questions about this document.`,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, systemMessage]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
      <PromptModifiers onPromptChange={handlePromptChange} />
      <FileUpload onUploadComplete={handleFileUpload} />
      
      <div className="card flex-1 overflow-y-auto mb-4 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
              <path d="M6 16H10L16 7L22 25L26 16H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-center">
              Golden Valley AI Assistant is ready to help.<br />
              Ask any question to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <Message
                key={index}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="card p-4">
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        
        <div className="flex items-end">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="input resize-none flex-1 py-3 min-h-[3rem] max-h-[10rem]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="ml-2 h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
          </button>
        </div>
        
        {promptInstructions.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Active modifiers:</span> {promptInstructions.join(', ')}
          </div>
        )}
      </form>
    </div>
  );
}

export default ChatInterface;