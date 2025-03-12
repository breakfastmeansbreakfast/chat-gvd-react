import { Row, Col } from 'react-bootstrap';
import { PersonFill, ChatSquareText } from 'react-bootstrap-icons';

function Message({ role, content, timestamp }) {
  const isUser = role === 'user';
  const isSystem = role === 'system';
  
  return (
    <Row className={`mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <Col xs="auto" className={`d-flex ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`message-avatar ${isUser ? 'user-avatar ms-2' : 'assistant-avatar me-2'}`}>
          {isUser ? (
            <PersonFill size={16} />
          ) : (
            <ChatSquareText size={16} />
          )}
        </div>
        
        <div>
          <div className={`p-3 rounded message-bubble ${
            isUser ? 'user-message' : isSystem ? 'system-message' : 'assistant-message'
          }`}>
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
          </div>
          
          {timestamp && (
            <div className="small text-muted mt-1">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
}

export default Message;