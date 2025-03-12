import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { fetchStatus } from './services/apiService';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import ChatInterface from './components/ChatInterface';

function App() {
  const [systemStatus, setSystemStatus] = useState({
    trello: false,
    documents: false,
    lastSync: null,
    documentCount: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatus = async () => {
      try {
        setLoading(true);
        const status = await fetchStatus();
        setSystemStatus(status);
      } catch (error) {
        console.error('Failed to fetch system status:', error);
      } finally {
        setLoading(false);
      }
    };

    getStatus();
    // Poll for status every minute
    const interval = setInterval(getStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content py-4">
        <Container className="px-3">
          <StatusBar 
            trelloConnected={systemStatus.trello} 
            documentsLoaded={systemStatus.documents}
            lastSync={systemStatus.lastSync}
            documentCount={systemStatus.documentCount}
            loading={loading}
          />
          <ChatInterface />
        </Container>
      </main>
      <footer className="bg-light py-3 text-center text-muted">
        <p className="small mb-0">© {new Date().getFullYear()} Golden Valley AI Assistant</p>
      </footer>
    </div>
  );
}

export default App;