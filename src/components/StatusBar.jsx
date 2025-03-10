import { useState } from 'react';
import { syncTrello } from '../services/apiService';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

function StatusBar({ trelloConnected, documentsLoaded, lastSync, documentCount, loading }) {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const handleSyncClick = async () => {
    if (syncing) return;
    
    try {
      setSyncing(true);
      setSyncMessage('');
      const result = await syncTrello();
      setSyncMessage(`Sync successful: ${result.message || 'Trello data synchronized'}`);
    } catch (error) {
      setSyncMessage(`Sync failed: ${error.message || 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const formatLastSync = (syncTime) => {
    if (!syncTime) return 'Never';
    const date = new Date(syncTime);
    return date.toLocaleString();
  };

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-2">System Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${trelloConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>Trello: {trelloConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${documentsLoaded ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span>Documents: {documentsLoaded ? `${documentCount} loaded` : 'None'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${lastSync ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span>Last Sync: {loading ? 'Loading...' : formatLastSync(lastSync)}</span>
          </div>
          
          <button 
            onClick={handleSyncClick}
            disabled={syncing || loading}
            className="btn btn-secondary text-sm py-1 flex items-center"
          >
            {syncing ? (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4 mr-1" />
                Sync Now
              </>
            )}
          </button>
        </div>
      </div>
      
      {syncMessage && (
        <div className={`mt-2 text-sm ${syncMessage.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
          {syncMessage}
        </div>
      )}
    </div>
  );
}

export default StatusBar;