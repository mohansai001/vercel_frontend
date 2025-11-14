import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './RrfExcelUpload.css';

const RrfExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please select a valid Excel file (.xlsx or .xls)');
      setFile(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        setFile(droppedFile);
        setMessage('');
      } else {
        setMessage('Please select a valid Excel file (.xlsx or .xls)');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select an Excel file');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const rrfIds = jsonData.slice(1)
          .map(row => row[0])
          .filter(id => id && id.toString().trim() !== '');

        if (rrfIds.length === 0) {
          setMessage('No RRF IDs found in the Excel file');
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3001/api/upload-rrf-excel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rrfIds }),
        });

        const result = await response.json();

        if (result.success) {
          setMessage(`Successfully uploaded ${result.count} RRF IDs from Excel`);
          setFile(null);
          document.getElementById('fileInput').value = '';
        } else {
          setMessage(`Error: ${result.message}`);
        }
        setIsLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="rrf-upload-container">
      <div className="rrf-upload-card">
        <div className="upload-header">
          <div className="upload-icon">📊</div>
          <h2>Upload RRF IDs from Excel</h2>
          <p>Upload your Excel file containing RRF IDs to add them to the database</p>
        </div>
        
        <div 
          className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="drop-zone-content">
            {file ? (
              <>
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              </>
            ) : (
              <>
                <div className="upload-placeholder-icon">📁</div>
                <p>Drag & drop your Excel file here</p>
                <span>or</span>
              </>
            )}
          </div>
          
          <input
            id="fileInput"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="file-input"
          />
          
          <label htmlFor="fileInput" className="file-input-label">
            {file ? 'Change File' : 'Browse Files'}
          </label>
        </div>

        <div className="file-requirements">
          <h4>File Requirements:</h4>
          <ul>
            <li>Excel format (.xlsx or .xls)</li>
            <li>RRF IDs should be in the first column</li>
            <li>First row will be treated as header</li>
          </ul>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className={`upload-button ${!file || isLoading ? 'disabled' : ''}`}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Uploading...
            </>
          ) : (
            <>
              <span>📤</span>
              Upload RRF IDs
            </>
          )}
        </button>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            <span className="message-icon">
              {message.includes('Error') ? '❌' : '✅'}
            </span>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RrfExcelUpload;
