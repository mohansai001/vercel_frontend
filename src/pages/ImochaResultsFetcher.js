import React, { useState } from 'react';

const ImochaResultsFetcher = () => {
  const [testIds, setTestIds] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFetchResults = async () => {
    if (!testIds.trim()) {
      setMessage('Please enter test IDs');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Convert comma-separated string to array of numbers
      const testIdArray = testIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      
      console.log('🔄 Calling backend API...');
      console.log('📋 Test IDs:', testIdArray);
      console.log('📅 Date Range:', startDate, 'to', endDate);

      const response = await fetch('http://localhost:3001/api/fetch-and-save-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testIds: testIdArray,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }),
      });

      const result = await response.json();
      console.log('✅ Backend Response:', result);

      if (result.success) {
        setMessage(`Successfully fetched and saved ${result.count} test results`);
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>iMocha Results Fetcher</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Test IDs (comma-separated):</label>
        <input
          type="text"
          value={testIds}
          onChange={(e) => setTestIds(e.target.value)}
          placeholder="1292180, 1292181, 1292182"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Start Date (optional):</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>End Date (optional):</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <button
        onClick={handleFetchResults}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: isLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Fetching Results...' : 'Fetch iMocha Results'}
      </button>

      {message && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>How it works:</h3>
        <ol>
          <li><strong>Frontend</strong> → Calls our backend API</li>
          <li><strong>Backend</strong> → Calls iMocha API for each test ID</li>
          <li><strong>iMocha API</strong> → Returns test attempts/results</li>
          <li><strong>Backend</strong> → Saves results to database</li>
          <li><strong>Database</strong> → Stores in imocha_results table</li>
        </ol>
        
        <h4>iMocha API Endpoint:</h4>
        <code>GET https://apiv3.imocha.io/v3/tests/{testId}/attempts</code>
        
        <h4>Sample Test IDs:</h4>
        <ul>
          <li>1292180 - Junior Test</li>
          <li>1292181 - Senior Test</li>
          <li>1228695 - .NET Backend</li>
          <li>1228712 - Java Backend</li>
        </ul>
      </div>
    </div>
  );
};

export default ImochaResultsFetcher;
