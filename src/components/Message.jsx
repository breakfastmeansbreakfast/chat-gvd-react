import { UserIcon } from '@heroicons/react/24/solid';

function Message({ role, content, timestamp }) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] flex ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary-100 text-primary-700 ml-2' : 'bg-gray-200 text-gray-700 mr-2'
        }`}>
          {isUser ? (
            <UserIcon className="h-5 w-5" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 16H10L16 7L22 25L26 16H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        
        <div>
          <div className={`rounded-lg p-3 ${
            isUser ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
          
          {timestamp && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;