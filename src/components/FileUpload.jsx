import { useState, useRef } from 'react';
import { uploadDocument } from '../services/apiService';
import { ChevronUpIcon, ChevronDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/solid';

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
    <div className="card mb-6 overflow-hidden">
      <div 
        className="flex justify-between items-center cursor-pointer py-2 px-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium">Upload Documents</h3>
        <button className="text-gray-500" type="button">
          {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 border-t">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop a file here, or{' '}
              <button 
                type="button"
                className="text-primary-600 hover:text-primary-500 font-medium"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </button>
            </p>
            
            <p className="mt-1 text-xs text-gray-500">
              PDF, TXT, CSV, or other text documents (max. 10MB)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.txt,.csv,.doc,.docx,.md"
            />
          </div>
          
          {file && (
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{file.name}</span>
                <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(0)} KB</span>
              </div>
              
              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="btn btn-secondary mr-2"
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
                </button>
                
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 text-sm text-green-600">
              {success}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;