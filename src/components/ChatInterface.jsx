import { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';
import { sendMessage } from '../services/apiService';
import Message from './Message';
import PromptModifiers from './PromptModifiers';
import FileUpload from './FileUpload';

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
    <div className="chat-container">
      <PromptModifiers onPromptChange={handlePromptChange} />
      <FileUpload onUploadComplete={handleFileUpload} />
      
      <Card className="flex-grow-1 mb-3">
        <Card.Body className="messages-container">
          {messages.length === 0 ? (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                <path d="M6 16H10L16 7L22 25L26 16H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-center">
                Golden Valley AI Assistant is ready to help.<br />
                Ask any question to get started.
              </p>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <Message
                  key={index}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="d-flex justify-content-start mb-4">
                  <div className="bg-light p-3 rounded message-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger" className="py-2 mb-3">{error}</Alert>}
          
          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                as="textarea"
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{ 
                  resize: 'none', 
                  minHeight: '3rem',
                  maxHeight: '10rem',
                  overflow: 'auto' 
                }}
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={!inputValue.trim() || isLoading}
                className="d-flex align-items-center justify-content-center"
                style={{ width: '48px' }}
              >
                <SendFill />
              </Button>
            </InputGroup>
          </Form>
          
          {promptInstructions.length > 0 && (
            <div className="mt-2 small text-muted">
              <span className="fw-medium">Active modifiers:</span> {promptInstructions.join(', ')}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default ChatInterface;