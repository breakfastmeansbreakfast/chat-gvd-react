import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Conversation functions
export const sendMessage = async (message, conversationId, promptInstructions = []) => {
  try {
    // Combine user message with prompt instructions
    const fullPrompt = [
      ...promptInstructions,
      message
    ].filter(Boolean).join('\n');

    const response = await api.post('/chat', {
      message: fullPrompt,
      conversationId
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Document upload
export const uploadDocument = async (file) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

// Trello sync
export const syncTrello = async () => {
  try {
    const response = await api.post('/sync-trello');
    return response.data;
  } catch (error) {
    console.error('Error syncing Trello:', error);
    throw error;
  }
};

// Get system status
export const fetchStatus = async () => {
  try {
    // Get last sync time
    const syncResponse = await api.get('/last-sync');
    
    // For document and Trello status, we'll use a debug endpoint
    const statusResponse = await api.get('/debug/data');
    
    return {
      trello: statusResponse.data.trelloConnected,
      documents: statusResponse.data.documentCount > 0,
      lastSync: syncResponse.data.lastSync,
      documentCount: statusResponse.data.documentCount,
    };
  } catch (error) {
    console.error('Error fetching status:', error);
    // Return default values if error
    return {
      trello: false,
      documents: false,
      lastSync: null,
      documentCount: 0,
    };
  }
};

export default api;