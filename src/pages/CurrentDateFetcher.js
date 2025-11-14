import React, { useState } from 'react';

const CurrentDateFetcher = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCurrentDateResults = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3001/api/fetch-current-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Current date results fetched successfully!');
      } else {
        setMessage('❌ Failed to fetch results: ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Current Date Results Fetcher</h2>
      <p>Manually trigger fetching iMocha results for today's date.</p>
      <p><strong>Note:</strong> Results are automatically fetched every 5 minutes when the server is running.</p>
      
      <button 
        onClick={fetchCurrentDateResults}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Fetching...' : 'Fetch Current Date Results'}
      </button>
      
      {message && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CurrentDateFetcher;