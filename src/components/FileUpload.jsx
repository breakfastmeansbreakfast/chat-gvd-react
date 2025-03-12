import { useState, useRef } from 'react';
import { Card, Button, Form, ProgressBar, Alert, Collapse, Row, Col } from 'react-bootstrap';
import { ChevronUp, ChevronDown, FileEarmarkArrowUp } from 'react-bootstrap-icons';
import { uploadDocument } from '../services/apiService';

function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError('');
      setSuccess('');
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Upload the file
      const response = await uploadDocument(file);
      
      // Clear progress simulation
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(`File uploaded successfully: ${response.message || 'Document processed'}`);
      
      // Reset and notify parent
      setTimeout(() => {
        setFile(null);
        setUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        if (onUploadComplete) {
          onUploadComplete(response);
        }
      }, 2000);
      
    } catch (err) {
      setError(`Upload failed: ${err.response?.data?.error || err.message || 'Unknown error'}`);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header 
        className="d-flex justify-content-between align-items-center py-2"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer' }}
      >
        <h6 className="mb-0">Upload Documents</h6>
        <Button variant="link" className="p-0 text-decoration-none">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </Card.Header>
      
      <Collapse in={isOpen}>
        <div>
          <Card.Body>
            <div 
              className="border border-2 border-dashed rounded p-4 text-center mb-3"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{ borderStyle: 'dashed' }}
            >
              <FileEarmarkArrowUp size={48} className="text-secondary mb-2" />
              
              <p className="mb-1">
                Drag and drop a file here, or{' '}
                <Button 
                  variant="link"
                  className="p-0 text-decoration-none"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </Button>
              </p>
              
              <small className="text-muted">
                PDF, TXT, CSV, or other text documents (max. 10MB)
              </small>
              
              <Form.Control
                ref={fileInputRef}
                type="file"
                className="d-none"
                onChange={handleFileChange}
                accept=".pdf,.txt,.csv,.doc,.docx,.md"
              />
            </div>
            
            {file && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium">{file.name}</span>
                  <small className="text-muted">{(file.size / 1024).toFixed(0)} KB</small>
                </div>
                
                {uploading && (
                  <ProgressBar 
                    now={uploadProgress} 
                    className="mb-3" 
                    animated={uploadProgress < 100}
                  />
                )}
                
                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      setError('');
                      setSuccess('');
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            )}
            
            {error && (
              <Alert variant="danger" className="mt-3 py-2 small">
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" className="mt-3 py-2 small">
                {success}
              </Alert>
            )}
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
}

export default FileUpload;