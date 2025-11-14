import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import './Charts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [statusData, setStatusData] = useState({ total: 0, rejected: 0, shortlisted: 0 });

  useEffect(() => {
    // Fetch weekly data
    fetch('http://localhost:3001/api/candidates/weekly-counts')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setWeeklyData(data.data);
        }
      })
      .catch(error => console.error('Error fetching weekly data:', error));

    // Fetch status data
    fetch('http://localhost:3001/api/candidates/resume-counts')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStatusData({
            total: parseInt(data.data.total_resumes),
            rejected: parseInt(data.data.rejected_count),
            shortlisted: parseInt(data.data.shortlisted_count)
          });
        }
      })
      .catch(error => console.error('Error fetching status data:', error));
  }, []);

  const barData = {
    labels: weeklyData.map(item => item.week),
    datasets: [
      {
        label: 'Uploaded',
        data: weeklyData.map(item => parseInt(item.uploaded)),
        backgroundColor: '#6b7280',
        borderColor: '#4b5563',
        borderWidth: 1,
      },
      {
        label: 'Rejected',
        data: weeklyData.map(item => parseInt(item.rejected)),
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderWidth: 1,
      },
      {
        label: 'Shortlisted',
        data: weeklyData.map(item => parseInt(item.shortlisted)),
        backgroundColor: '#10b981',
        borderColor: '#0d9668',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Total Resumes', 'Rejected', 'Shortlisted'],
    datasets: [
      {
        data: [statusData.total, statusData.rejected, statusData.shortlisted],
        backgroundColor: ['#6b7280', '#ef4444', '#10b981'],
        borderColor: ['#4b5563', '#dc2626', '#0d9668'],
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#10b981',
        },
      },
      title: {
        display: true,
        text: 'Weekly Resume Status',
        color: '#10b981',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#666',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: '#666',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#10b981',
        },
      },
      title: {
        display: true,
        text: 'Candidates Resume Status ',
        color: '#10b981',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
  };

  const downloadReport = () => {
    // Add download functionality here
    console.log('Downloading report...');
  };

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h1>Analytics Dashboard</h1>
        <button className="download-report-btn" onClick={downloadReport}>
          📊 Download Full Report
        </button>
      </div>
      
      <div className="charts-grid">
        <div className="chart-card">
          <Bar data={barData} options={barOptions} />
        </div>
        
        <div className="chart-card">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;