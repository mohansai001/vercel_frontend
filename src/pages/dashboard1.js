import React, { useState, useEffect } from 'react';
import { MdPeople, MdCheckCircle, MdCancel, MdEmail } from 'react-icons/md';

const Dashboard1 = () => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadCount, setUploadCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [inviteCount, setInviteCount] = useState(0);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('candidate_name');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch iMocha data
      const shortlistedRes = await fetch("https://demotag.vercel.app/api/shortlisted-count");
      const shortlistedData = await shortlistedRes.json();
      setInviteCount(shortlistedData.inviteCount);
      
      // Fetch RRF Tracking data (all candidates)
      const candidatesRes = await fetch("http://localhost:3001/api/get-shortlisted-candidates");
      const response = await candidatesRes.json();
      
      if (response.candidates && Array.isArray(response.candidates)) {
        setCandidates(response.candidates);
        
        // Use same approach as old dashboard
        const ecMappingParam = localStorage.getItem("ec_mapping");
        if (ecMappingParam) {
          const countResponse = await fetch(`https://demotag.vercel.app/api/candidate-counts?eng_center=${encodeURIComponent(ecMappingParam)}`);
          const countData = await countResponse.json();
          if (!countData.error) {
            setUploadCount(countData.totalCount);
            setShortlistedCount(countData.shortlistedCount);
            setRejectedCount(countData.rejectedCount);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to bottom right, #e25f44, #f5f5f7)',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
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
      width: '156px',
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
      textTransform: 'uppercase'
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
      fontSize: '16px'
    },
    tableElement: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px'
    },
    th: {
      padding: '8px',
      textAlign: 'left',
      fontWeight: 'bold',
      borderBottom: '1px solid #dee2e6',
      fontSize: '11px',
      color: '#333',
      backgroundColor: 'white',
      border: 'none'
    },
    td: {
      padding: '8px',
      borderBottom: '1px solid #dee2e6',
      fontSize: '12px',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: '#333',
      backgroundColor: 'white'
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
      marginBottom: '1px'
    },
    bottomRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '3px'
    },
    topCards: {
      display: 'flex',
      gap: '8px',
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
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflowX: 'auto'
    },
    graphCard: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '20px'
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
        <div style={styles.tableHeaderOnly}>
          <div style={styles.tableHeader}>
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
        </div>
      </div>
      
      <div style={styles.bottomRow}>
        <div style={styles.leftColumn}>
          <div style={styles.bottomCards}>
            <div style={styles.metricCard}>
              <MdCancel style={styles.cardIcon} />
              <div style={styles.cardNumber}>{rejectedCount}</div>
              <div style={styles.cardLabel}>REJECTED</div>
            </div>
            <div style={styles.metricCard}>
              <MdEmail style={styles.cardIcon} />
              <div style={styles.cardNumber}>{inviteCount}</div>
              <div style={styles.cardLabel}>IMOCHA INVITE</div>
            </div>
          </div>
          <div style={{...styles.statsCard, marginTop: '10px'}}>
            <div style={styles.tabs}>
              <button 
                style={{...styles.tab, ...(activeTab === 'monthly' ? styles.activeTab : {})}}
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </button>
              <button 
                style={{...styles.tab, ...(activeTab === 'yearly' ? styles.activeTab : {})}}
                onClick={() => setActiveTab('yearly')}
              >
                Yearly
              </button>
            </div>
            <div style={styles.amount}>{activeTab === 'monthly' ? '156' : '1,890'}</div>
            <p>{activeTab === 'monthly' ? 'Monthly Candidates' : 'Yearly Candidates'}</p>
          </div>
          <div style={styles.graphCard}>
            <div style={styles.graphHeader}>
              <span style={styles.graphTitle}>RRF Analytics - {activeTab}</span>
            </div>
            <div style={styles.rrfContainer}>
              <div style={styles.rrfMetric}>
                <div style={styles.rrfNumber}>{activeTab === 'monthly' ? '156' : '1,890'}</div>
                <div style={styles.rrfLabel}>Total RRFs</div>
              </div>
              <div style={styles.rrfMetric}>
                <div style={styles.rrfNumber}>{activeTab === 'monthly' ? '23' : '287'}</div>
                <div style={styles.rrfLabel}>Repeated RRFs</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.tableOnly}>
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

export default Dashboard1;