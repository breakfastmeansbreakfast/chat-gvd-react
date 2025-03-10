import { useState, useEffect } from 'react'
import { fetchStatus } from './services/apiService'
import Header from './components/Header'
import StatusBar from './components/StatusBar'
import ChatInterface from './components/ChatInterface'
import './App.css'

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <StatusBar 
          trelloConnected={systemStatus.trello} 
          documentsLoaded={systemStatus.documents}
          lastSync={systemStatus.lastSync}
          documentCount={systemStatus.documentCount}
          loading={loading}
        />
        <ChatInterface />
      </main>
      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} Golden Valley AI Assistant</p>
      </footer>
    </div>
  )
}

export default App