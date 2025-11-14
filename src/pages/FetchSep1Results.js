import React, { useState } from 'react';

const FetchSep1Results = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const fetchSep1Results = async () => {
    setIsLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('http://localhost:3001/api/fetch-and-save-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testIds: [1292180, 1292181, 1292182, 1228695, 1228712], // Common test IDs
          startDate: '2025-09-01',
          endDate: '2025-09-01'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data);
      } else {
        setError(data.message || 'Failed to fetch results');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Fetch September 1st, 2025 iMocha Results</h2>
      
      <button
        onClick={fetchSep1Results}
        disabled={isLoading}
        style={{
          padding: '12px 24px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {isLoading ? 'Fetching...' : 'Fetch Sep 1st Results'}
      </button>

      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {results && (
        <div style={{
          marginTop: '15px',
          padding: '15px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          <h3>✅ Success!</h3>
          <p>Fetched and saved <strong>{results.count}</strong> test results from September 1st, 2025</p>
          <p><em>{results.message}</em></p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h4>What this does:</h4>
        <ul>
          <li>Calls iMocha API for test results on Sep 1st, 2025</li>
          <li>Fetches from test IDs: 1292180, 1292181, 1292182, 1228695, 1228712</li>
          <li>Saves results to imocha_results table in database</li>
          <li>Returns count of successfully saved results</li>
        </ul>
      </div>
    </div>
  );
};

export default FetchSep1Results;
