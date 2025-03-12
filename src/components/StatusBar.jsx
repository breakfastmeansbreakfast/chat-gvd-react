import { useState } from 'react';
import { Card, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { ArrowClockwise } from 'react-bootstrap-icons';
import { syncTrello } from '../services/apiService';

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
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3">System Status</h5>
        
        <Row className="mb-2">
          <Col xs={12} md={4} className="mb-2 mb-md-0 d-flex align-items-center">
            <Badge 
              bg={trelloConnected ? "success" : "danger"} 
              className="me-2"
              style={{ width: "10px", height: "10px", padding: 0, borderRadius: "50%" }}
            />
            <span>Trello: {trelloConnected ? 'Connected' : 'Disconnected'}</span>
          </Col>
          
          <Col xs={12} md={4} className="mb-2 mb-md-0 d-flex align-items-center">
            <Badge 
              bg={documentsLoaded ? "success" : "warning"} 
              className="me-2"
              style={{ width: "10px", height: "10px", padding: 0, borderRadius: "50%" }}
            />
            <span>Documents: {documentsLoaded ? `${documentCount} loaded` : 'None'}</span>
          </Col>
          
          <Col xs={12} md={4} className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Badge 
                bg={lastSync ? "success" : "warning"} 
                className="me-2"
                style={{ width: "10px", height: "10px", padding: 0, borderRadius: "50%" }}
              />
              <span>Last Sync: {loading ? 'Loading...' : formatLastSync(lastSync)}</span>
            </div>
            
            <Button 
              variant="outline-secondary"
              size="sm"
              onClick={handleSyncClick}
              disabled={syncing || loading}
              className="d-flex align-items-center"
            >
              {syncing ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <ArrowClockwise className="me-1" />
                  <span>Sync Now</span>
                </>
              )}
            </Button>
          </Col>
        </Row>
        
        {syncMessage && (
          <div className={`mt-2 small ${syncMessage.includes('failed') ? 'text-danger' : 'text-success'}`}>
            {syncMessage}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default StatusBar;