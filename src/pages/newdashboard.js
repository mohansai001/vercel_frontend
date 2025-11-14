
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MdPeople, MdCheckCircle, MdEmail } from 'react-icons/md';

// Add missing variables to fix ESLint no-undef errors
const uploadCount = 0;
const shortlistedCount = 0;

const loading = false;

const NewDashboard = () => {
  // Example data for monthly and yearly graphs
  const monthlyData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 15000 },
    { name: 'Mar', value: 18000 },
    { name: 'Apr', value: 23231 },
    { name: 'May', value: 21000 },
    { name: 'Jun', value: 22000 },
    { name: 'Jul', value: 23000 },
  ];
  const yearlyData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1500 },
    { name: 'Mar', value: 1800 },
    { name: 'Apr', value: 1890 },
    { name: 'May', value: 1700 },
    { name: 'Jun', value: 1750 },
    { name: 'Jul', value: 1800 },
  ];
  const [activeTab, setActiveTab] = useState('monthly');
  const [candidates] = useState([]);
  // Remove unused state setters
  // Define PAGE_SIZE and missing variables
  const PAGE_SIZE = 10;
  const totalRrfMonthly = 0;
  const totalRrfYearly = 0;
  const shortlistedMonthly = 0;
  const shortlistedYearly = 0;


  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('candidate_name');
  const [page, setPage] = useState(1);
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'white', // changed to white
                  borderRadius: '20px',
                  padding: '1px', // reduce padding by 3px
                  width: 'fit-content',
                  margin: '0 auto',
                  marginBottom: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                }}>
                  <button
                    onClick={() => setActiveTab('monthly')}
                    style={{
                      background: activeTab === 'monthly' ? '#fff' : 'transparent', // switch background white
                      color: activeTab === 'monthly' ? '#000' : '#000', // text black
                      border: 'none',
                      borderRadius: '16px',
                      padding: '3px 15px', // reduce by 3px
                      fontSize: '13px', // reduce by 1px
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginRight: '2px',
                      boxShadow: activeTab === 'monthly' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                      outline: 'none',
                      minWidth: '77px' // reduce by 3px
                    }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setActiveTab('yearly')}
                    style={{
                      background: activeTab === 'yearly' ? '#fff' : 'transparent', // switch background white
                      color: activeTab === 'yearly' ? '#000' : '#000', // text black
                      border: 'none',
                      borderRadius: '16px',
                      padding: '3px 15px', // reduce by 3px
                      fontSize: '13px', // reduce by 1px
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginLeft: '2px',
                      boxShadow: activeTab === 'yearly' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                      outline: 'none',
                      minWidth: '77px' // reduce by 3px
                    }}
                  >
                    Yearly
                  </button>
                </div>

  // Filter and sort candidates
  const filteredAndSortedCandidates = candidates
    .filter(candidate => 
      candidate.rrf_id?.toLowerCase().includes(search.toLowerCase()) ||
      candidate.candidate_name?.toLowerCase().includes(search.toLowerCase()) ||
      candidate.candidate_email?.toLowerCase().includes(search.toLowerCase()) ||
      candidate.role?.toLowerCase().includes(search.toLowerCase()) ||
      candidate.recruitment_phase?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      return aVal.toString().localeCompare(bVal.toString());
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCandidates.length / PAGE_SIZE);
  const paginatedCandidates = filteredAndSortedCandidates.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const styles = {
    container: {
  padding: '15px',
  fontFamily: 'Roboto, sans-serif',
  background: 'inherit', // Use global background
    },
    header: {
      display: 'flex',
  
    },
    title: {
      fontSize: '25.2px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    actions: {
      display: 'flex',
      gap: '10px'
    },
    actionBtn: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      gap: '20px'
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginBottom: '20px'
    },
    metricCard: {
      backgroundColor: 'white',
      padding: '8px',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center',
      minHeight: '40px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    cardNumber: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '3px'
    },
    cardLabel: {
      fontSize: '10px',
      fontWeight: '600',
      color: '#666',
      textTransform: 'uppercase',
      padding: '0 0 6px 0',
    },
    cardIcon: {
      fontSize: '16px',
      color: '#000000',
      marginBottom: '4px'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    statsCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tabs: {
      display: 'flex',
      marginBottom: '20px'
    },
    tab: {
      padding: '10px 20px',
      border: 'none',
      backgroundColor: '#f8f9fa',
      cursor: 'pointer',
      borderRadius: '4px 4px 0 0'
    },
    activeTab: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    amount: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#333',
      margin: '10px 0'
    },
    table: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    tableHeader: {
      padding: '8px 15px',
      fontWeight: 'bold',
      background: 'white', // changed to white
    },
    tableElement: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      padding: '8px 3px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '11px',
      color: '#333',
      backgroundColor: 'white',
      border: 'none'
    },
    td: {
      padding: '8px 3px',
      fontSize: '12px',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#333',
      backgroundColor: 'white',
      border: 'none'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      fontSize: '14px'
    },
    tableHeaderContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    tableControls: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    searchInput: {
      padding: '6px 8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '12px',
      width: '150px'
    },
    sortSelect: {
      padding: '6px 8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '12px',
      backgroundColor: 'white',
      cursor: 'pointer',
      outline: 'none',
      minWidth: '120px'
    },
    evenRow: {
      backgroundColor: '#f8f9fa'
    },
    oddRow: {
      backgroundColor: 'white'
    },
    paginationControls: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    pageBtn: {
      padding: '6px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px'
    },
    disabledBtn: {
      backgroundColor: '#f8f9fa',
      color: '#6c757d',
      cursor: 'not-allowed'
    },
    pageInfo: {
      fontSize: '14px',
      color: '#495057'
    },
    controlsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      padding: '8px 15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    tableTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333'
    },
    controlsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '15px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    topCardsRow: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px'
    },
    bottomCardsRow: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px'
    },
    rightColumn: {
      display: 'flex',
      flexDirection: 'column'
    },
    topRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px'
    },
    bottomRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '0px'
    },
    topCards: {
      display: 'flex',
      gap: '10px',
      width: '320px',
      height: '50px'
    },
    bottomCards: {
      display: 'flex',
      gap: '8px',
      width: '320px',
      height: '50px',
      marginBottom: '10px'
    },
    leftPanelCards: {
      display: 'flex',
      gap: '10px',
      flex: 1,
      height: '50px'
    },
    leftColumn: {
      width: '320px'
    },
    tableHeaderOnly: {
      flex: '1 1 0%',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px',
      height: '50px'
    },
    tableOnly: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    graphCard: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '10px'
    },
    graphHeader: {
      marginBottom: '15px'
    },
    graphTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333'
    },
    rrfContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px'
    },
    rrfMetric: {
      textAlign: 'center',
      flex: 1
    },
    rrfNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: '5px'
    },
    rrfLabel: {
      fontSize: '12px',
      color: '#666',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          .dashboard1-table th {
            background: white !important;
            color: #333 !important;
          }
          .dashboard1-table td {
            background: white !important;
            color: #333 !important;
          }
        `}
      </style>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
      </div>
      <div style={styles.topRow}>
        <div style={styles.topCards}>
          <div style={styles.metricCard}>
            <MdPeople style={styles.cardIcon} />
            <div style={styles.cardNumber}>{uploadCount}</div>
            <div style={styles.cardLabel}>APPLICATIONS</div>
          </div>
          <div style={styles.metricCard}>
            <MdCheckCircle style={styles.cardIcon} />
            <div style={styles.cardNumber}>{shortlistedCount}</div>
            <div style={styles.cardLabel}>SHORTLISTED</div>
          </div>
        </div>
        {/* <div style={styles.topCards}> */}
          <div style={styles.leftPanelCards}>
          <div style={styles.metricCard}>
            <MdPeople style={styles.cardIcon} />
            <div style={styles.cardNumber}>0</div>
            <div style={styles.cardLabel}>INTERVIEWS</div>
          </div>
          <div style={styles.metricCard}>
            <MdCheckCircle style={styles.cardIcon} />
            <div style={styles.cardNumber}>0</div>
            <div style={styles.cardLabel}>OFFERS</div>
          </div>
          <div style={styles.metricCard}>
            <MdCheckCircle style={styles.cardIcon} />
            <div style={styles.cardNumber}>0</div>
            <div style={styles.cardLabel}>HIRED</div>
          </div>
          <div style={styles.metricCard}>
            <MdEmail style={styles.cardIcon} />
            <div style={styles.cardNumber}>0</div>
            <div style={styles.cardLabel}>PENDING</div>
          </div>
        </div>
      </div>
      
      <div style={styles.bottomRow}>
        <div style={styles.leftColumn}>

          <div style={{...styles.graphCard, marginTop: '0px'}}>
            <div style={styles.graphHeader}>
              <span style={styles.graphTitle}>Recurring stats</span>
              <div style={{ float: 'right', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#eee',
                  borderRadius: '16px',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  minWidth: '70px',
                  userSelect: 'none',
                }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: activeTab === 'monthly' ? '#fff' : 'transparent',
                      color: activeTab === 'monthly' ? '#000' : '#333',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setActiveTab('monthly')}
                  >Monthly</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: activeTab === 'yearly' ? '#fff' : 'transparent',
                      color: activeTab === 'yearly' ? '#000' : '#333',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setActiveTab('yearly')}
                  >Yearly</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                  {activeTab === 'monthly' ? `Total RRFs: ${totalRrfMonthly}` : `Total RRFs: ${totalRrfYearly}`}
                </div>
                <div style={{ width: '100%', height: 80 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeTab === 'monthly' ? monthlyData : yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={10} hide={true} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={activeTab === 'monthly' ? '#8e44ad' : '#27ae60'} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                  {activeTab === 'monthly' ? `Shortlisted: ${shortlistedMonthly}` : `Shortlisted: ${shortlistedYearly}`}
                </div>
                <div style={{ width: '100%', height: 80 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeTab === 'monthly' ? monthlyData : yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={10} hide={true} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={activeTab === 'monthly' ? '#2980b9' : '#e67e22'} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
                    <div style={{...styles.graphCard, marginTop: '10px'}}>
            <div style={styles.graphHeader}>
              <span style={styles.graphTitle}>TAG Analystics</span>
              <div style={{ float: 'right', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#eee',
                  borderRadius: '16px',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  minWidth: '70px',
                  userSelect: 'none',
                }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: activeTab === 'monthly' ? '#fff' : 'transparent',
                      color: activeTab === 'monthly' ? '#000' : '#333',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setActiveTab('monthly')}
                  >Monthly</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: activeTab === 'yearly' ? '#fff' : 'transparent',
                      color: activeTab === 'yearly' ? '#000' : '#333',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => setActiveTab('yearly')}
                  >Yearly</span>
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 10, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                  {activeTab === 'monthly' ? `Total RRFs: ${totalRrfMonthly}` : `Total RRFs: ${totalRrfYearly}`}
                </div>
                <div style={{ width: '100%', height: 80 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeTab === 'monthly' ? monthlyData : yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={10} hide={true} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={activeTab === 'monthly' ? '#8e44ad' : '#27ae60'} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 5 }}>
                  {activeTab === 'monthly' ? `Shortlisted: ${shortlistedMonthly}` : `Shortlisted: ${shortlistedYearly}`}
                </div>
                <div style={{ width: '100%', height: 80 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeTab === 'monthly' ? monthlyData : yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={10} />
                      <YAxis fontSize={10} hide={true} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={activeTab === 'monthly' ? '#2980b9' : '#e67e22'} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.tableOnly}>
          <div style={{...styles.tableHeader, marginBottom: '10px'}}>
            <div style={styles.tableHeaderContent}>
              <span style={{color: 'black', fontWeight: 'bold', fontSize: '12px'}}>Recurring Records</span>
              <div style={styles.tableControls}>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={styles.searchInput}
                /> 
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.sortSelect}
                >
                  <option value="rrf_id">Sort by RRF ID</option>
                  <option value="candidate_name">Sort by Name</option>
                  <option value="candidate_email">Sort by Email</option>
                  <option value="role">Sort by Role</option>
                  <option value="recruitment_phase">Sort by Phase</option>
                </select>
              </div>
            </div>
          </div>
          <table style={styles.tableElement} className="dashboard1-table">
            <thead>
              <tr>
                <th style={styles.th}>RRF ID</th>
                <th style={styles.th}>CANDIDATE NAME</th>
                <th style={styles.th}>EMAIL</th>
                <th style={styles.th}>ROLE</th>
                <th style={styles.th}>PHASE</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{...styles.td, textAlign: 'center', padding: '20px'}}>
                    Loading candidates...
                  </td>
                </tr>
              ) : filteredAndSortedCandidates.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{...styles.td, textAlign: 'center', padding: '20px'}}>
                    No candidates found
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((candidate, idx) => (
                  <tr key={idx} style={idx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    <td style={styles.td}>{candidate.rrf_id || 'N/A'}</td>
                    <td style={styles.td}>{candidate.candidate_name?.trim() || 'N/A'}</td>
                    <td style={styles.td}>{candidate.candidate_email || 'N/A'}</td>
                    <td style={styles.td}>{candidate.role || 'N/A'}</td>
                    <td style={styles.td}>{candidate.recruitment_phase || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <span>Showing {(page - 1) * PAGE_SIZE + 1} – {Math.min(page * PAGE_SIZE, filteredAndSortedCandidates.length)} of {filteredAndSortedCandidates.length} items</span>
            <div style={styles.paginationControls}>
              <button 
                style={{...styles.pageBtn, ...(page === 1 ? styles.disabledBtn : {})}}
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
              <button 
                style={{...styles.pageBtn, ...(page === totalPages ? styles.disabledBtn : {})}}
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;