import React, { useState, useEffect, useRef } from 'react';
import './apprecruit.css'; // Corrected CSS import path
import { useNavigate } from 'react-router-dom';
import jspdf from 'jspdf';
import * as msal from '@azure/msal-browser';

const Toast = ({ message, type, show }) => {
  if (!show) return null;
  return <div className={`toast show ${type}`}>{message}</div>;
};

// const Sidebar = ({ onNavigate, onLogout }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <>
//       <button id="toggle-sidebar-btn" onClick={() => setIsOpen(!isOpen)}>☰ Menu</button>
//       <div id="sidebar" className={`sidebar-menu ${isOpen ? 'show' : ''}`} style={{ width: '200px' }}>
//         <div className="sidebar-option active" onClick={() => onNavigate('Dashboard.html')}>
//           <i className="fas fa-tachometer-alt"></i>
//           <span>Dashboard</span>
//         </div>
//         <div className="sidebar-option" onClick={() => onNavigate('ECselection.html')}>
//           <i className="fas fa-users"></i>
//           <span>Recruit</span>
//         </div>
//         <div className="sidebar-option" onClick={() => onNavigate('candidatespage.html')}>
//           <i className="fas fa-tasks"></i><span>RRF Tracking</span>
//         </div>
//         <div className="sidebar-option" onClick={() => onNavigate('GTPrescreening.html')}>
//           <i className="fas fa-tasks"></i><span>GT's Prescreening</span>
//         </div>
//         <div className="sidebar-option logout-option" onClick={onLogout}>
//           <i className="fas fa-sign-out-alt"></i>
//           <span>Logout</span>
//         </div>
//       </div>
//     </>
//   );
// };



// --- Main App Component ---

function AppRecruit() {
  const navigate = useNavigate();

  // --- State Management ---
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });
  const [jobDescription, setJobDescription] = useState('');
  const [jdPreview, setJdPreview] = useState(null);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const [ecName, setEcName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRrfId, setSelectedRrfId] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  const [duplicateCandidates, setDuplicateCandidates] = useState(new Set());
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rrfIds, setRrfIds] = useState([]);

  const msalInstanceRef = useRef(null);

  // --- Effects (Lifecycle) ---

  // Initialize MSAL and load initial data
  useEffect(() => {
    const msalConfig = {
      auth: {
        clientId: 'ed0b1bf7-b012-4e13-a526-b696932c0673',
        authority: 'https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323',
        redirectUri: 'https://tagaifrontend-caa2hfb2dfhjfrg8.canadacentral-01.azurewebsites.net',
      },
    };
    if (window.msal) {
      msalInstanceRef.current = new msal.PublicClientApplication(msalConfig);
    }

    const urlParams = new URLSearchParams(window.location.search);
    setEcName(urlParams.get('selectedValue') || '');

    // Fetch RRF IDs and user email
    fetchRrfIds();
    getUserEmail();
  }, []);

  // --- Functions (Converted from original JS) ---

  const showToast = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast({ message: '', type: 'success', show: false });
    }, 3000);
  };

  const fetchRrfIds = async () => {
    try {
      console.log(
        'Fetching RRF IDs from http://localhost:3001/api/rrf-ids'
      );
      const response = await fetch(
        'http://localhost:3001/api/rrf-ids'
      );
      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('RRF IDs data:', data);
        setRrfIds(data.rrfIds || []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch RRF IDs:', response.status, errorText);
        // Fallback: set empty array so dropdown still works
        setRrfIds([]);
      }
    } catch (error) {
      console.error('Error fetching RRF IDs:', error);
      // Fallback: set empty array so dropdown still works
      setRrfIds([]);
    }
  };

  // const navigateTo = (page) => {
  //     window.location.href = page;
  // };

  const showDuplicateModal = (email, name) => {
    setDuplicateCandidates((prev) => new Set(prev).add(`${name} - ${email}`));
    setIsDuplicateModalOpen(true);
  };

  const sendCandidateInfoToDB = (candidateDetails) => {
    fetch(
      'http://localhost:3001/api/add-candidate-info',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateDetails),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('✅ Candidate info saved:', data);
          localStorage.setItem('candidateId', data.data.id);
        } else if (data.code === '23505') {
          // Duplicate error code
          showDuplicateModal(candidateDetails.candidate_email, candidateDetails.candidate_name);
        } else {
          console.warn('Unhandled DB response:', data);
        }
      })
      .catch((error) => {
        console.error('❌ Error saving candidate:', error);
      });
  };

  const getGithubToken = async () => {
    try {
      const response = await fetch('https://demotag.vercel.app/api/github-token');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Failed to fetch GitHub token:', error);
      showToast('Failed to fetch GitHub token', 'error');
      return null;
    }
  };




  const getUserEmail = async () => {
    try {
      const msalConfig = {
        auth: {
          clientId: 'ed0b1bf7-b012-4e13-a526-b696932c0673',
          authority: 'https://login.microsoftonline.com/13085c86-4bcb-460a-a6f0-b373421c6323',
          redirectUri: 'https://tagaifrontend-caa2hfb2dfhjfrg8.canadacentral-01.azurewebsites.net',
        },
      };
      const msalInstance = new msal.PublicClientApplication(msalConfig);
      await msalInstance.initialize();
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        setUserEmail(accounts[0].username);
      }
    } catch (error) {
      console.error('Error getting user email:', error);
    }
  };

  const extractJdInfo = (jdContent) => {
    const title = jdContent.match(/(?:position|role|job title|title)\s*:?\s*([^\n\r.]+)/i)?.[1]?.trim() || 
                  jdContent.split('\n')[0]?.trim().substring(0, 50) || 'Not specified';
    
    const experience = jdContent.match(/(?:experience|years?)\s*:?\s*([^\n\r.]+)/i)?.[1]?.trim() || 
                      jdContent.match(/(\d+)\s*(?:\+|to|-)\s*(?:\d+)?\s*years?/i)?.[0] || 'Not specified';
    
    const skillsMatch = jdContent.match(/(?:skills?|technologies?|requirements?)\s*:?\s*([\s\S]*?)(?:\n\n|$)/i);
    const skills = skillsMatch ? skillsMatch[1].trim().substring(0, 100) + '...' : 'Not specified';
    
    return { title, experience, skills };
  };

  const handleJdUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const jdContent = await readFileContent(file);
        setJobDescription(jdContent);
        const jdInfo = extractJdInfo(jdContent);
        setJdPreview(jdInfo);
      } catch (error) {
        showToast('Error reading JD file', 'error');
      }
    }
  };

  const handleResumeUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedResumes(files);
  };

  const removeResume = (index) => {
    const updatedResumes = selectedResumes.filter((_, i) => i !== index);
    setSelectedResumes(updatedResumes);
    // Update the file input
    const fileInput = document.getElementById('resume');
    const dt = new DataTransfer();
    updatedResumes.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
  };

  const handleUploadResume = async (event) => {
    event.preventDefault();
    const form = event.target;
    const resumeFiles = form.elements.resume.files;
    const jdFiles = form.elements.jobDescription.files;



    if (!resumeFiles || resumeFiles.length === 0) {
      showToast('Please upload at least one resume.', 'error');
      return;
    }

    if (!jdFiles || jdFiles.length === 0) {
      showToast('Please upload a job description.', 'error');
      return;
    }



    setIsLoading(true);

    const uploadedResumeFiles = [];
    let jdContent = '';

    try {
      // Upload resumes
      for (let i = 0; i < resumeFiles.length; i++) {
        const file = resumeFiles[i];
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${file.name}`;
        const resumeUrl = await uploadToGitHub(uniqueFileName, file, 'resumes');

        if (resumeUrl) {
          uploadedResumeFiles.push({ resumeUrl, fileName: file.name });
        }
      }

      // Read JD content
      const jdFile = jdFiles[0];
      jdContent = await readFileContent(jdFile);

      // Pass data to ResumeAnalysis via sessionStorage
      sessionStorage.setItem(
        'uploadedResumes',
        JSON.stringify({
          files: uploadedResumeFiles,
          hrEmail: userEmail,
          rrfId: selectedRrfId,
          jobDescription: jdContent,
          ecName: 'App EC',
        })
      );

      // Navigate to ResumeAnalysis
      navigate('/resume-analysis');
    } catch (error) {
      console.error('Error uploading resumes:', error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = async (file) => {
    if (file.name.endsWith('.docx')) {
      // Handle Word documents
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target.result;
            const result = await window.mammoth.extractRawText({ arrayBuffer });
            resolve(result.value);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    } else {
      // Handle text files
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    }
  };

  const uploadToGitHub = async (fileName, file, folderPath = 'resumes') => {
    const githubToken = await getGithubToken();
    if (!githubToken) return null;

    const repoOwner = 'mohansai001';
    const repoName = 'resume';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}/${fileName}`;

    const base64Content = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

    try {
      // **FIX 2: Check if file exists to get its SHA for updates**
      let sha = null;
      const checkFileResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${githubToken}` },
      });

      if (checkFileResponse.ok) {
        const existingFileData = await checkFileResponse.json();
        sha = existingFileData.sha;
      } else if (checkFileResponse.status !== 404) {
        // If it's not a 404 (Not Found), then it's some other error
        throw new Error(`GitHub check file API error: ${checkFileResponse.status}`);
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload resume: ${fileName}`,
          content: base64Content,
          sha: sha, // Include SHA if it exists (for updates)
        }),
      });

      if (response.status === 422) {
        console.warn(
          'GitHub API returned 422. This can happen if the file content is identical. Assuming success.'
        );
        // To get the download URL even on a 422, we construct it.
        // This assumes the file *is* there.
        return `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${folderPath}/${fileName}`;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload to GitHub');
      }

      const data = await response.json();
      return data.content.download_url;
    } catch (error) {
      console.error('Error uploading to GitHub:', error);
      showToast(`GitHub Upload Error: ${error.message}`, 'error');
      return null;
    }
  };

  const handleBackToSelection = () => {
    setEvaluationResult(null);
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div id="loading-popup" style={{ display: 'flex' }}>
        <div
          style={{
            border: '6px solid rgba(255, 255, 255, 0.3)',
            borderTop: '6px solid #ffffff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <span style={{ marginTop: '20px' }}>Please wait while resume is being evaluated!...</span>
      </div>
    );
  }

  if (evaluationResult) {
    // Render the evaluation result view
    return (
      <EvaluationResultView
        result={evaluationResult}
        onBack={handleBackToSelection}
        selectedRoleInfo={{
          selectedRole,
          selectedLevel,
          selectedCloudProvider,
          selectedFrontendTech,
          ecName,
        }}
        sendCandidateInfoToDB={sendCandidateInfoToDB}
      />
    );
  }

  return (
    <>
      <Toast {...toast} />
      {/* <Sidebar onNavigate={navigateTo} onLogout={handleLogout} /> */}

      {/* <div className="backbutton" onClick={() => navigateTo('ECselection.html')}>
        <i className="fas fa-arrow-left"></i>
      </div> */}


      <div id="interviews" className="active">
        <div className="role-selection-container">
          <div className="role-selection-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
            <h1 style={{ color: 'black', margin: '0' }}>
              Resume Analyzer
            </h1>
            <div style={{ backgroundColor: '#10b981', color: '#ffffff', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
              👤 {userEmail || 'Loading...'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px', padding: '20px', backgroundColor: '#000000', minHeight: '100vh' }}>
            <form onSubmit={handleUploadResume} style={{ width: '600px', padding: '40px', backgroundColor: '#1a1a1a', borderRadius: '15px', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)', border: '1px solid #10b981' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 style={{ color: '#10b981', fontSize: '28px', fontWeight: '600', margin: '0 0 10px 0' }}>Resume Analyzer</h2>
                <p style={{ color: '#cccccc', fontSize: '16px', margin: '0' }}>Upload your job description and resumes for AI-powered analysis</p>
              </div>
              






              <div style={{ marginBottom: '25px' }}>
                <label htmlFor="jobDescription" style={{ color: '#ffffff', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>📄 Job Description</label>
                <div style={{ border: '2px dashed #10b981', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: '#000000', transition: 'all 0.3s ease' }}>
                  <input type="file" id="jobDescription" name="jobDescription" accept=".txt,.pdf,.doc,.docx" required onChange={handleJdUpload} style={{ display: 'none' }} />
                  <label htmlFor="jobDescription" style={{ cursor: 'pointer', color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>📁 Click to upload job description</label>
                  <p style={{ color: '#cccccc', fontSize: '12px', margin: '5px 0 0 0' }}>Supports .txt, .pdf, .doc, .docx files</p>
                </div>
                {jdPreview && (
                  <div style={{ marginTop: '15px', padding: '20px', backgroundColor: '#000000', border: '1px solid #10b981', borderRadius: '8px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ color: '#10b981', margin: '0', fontSize: '16px', fontWeight: '600' }}>✅ Job Description Loaded</h4>
                      <button type="button" onClick={() => setJdPreview(null)} style={{ padding: '6px 12px', backgroundColor: '#ff0000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>✕ Remove</button>
                    </div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <p style={{ margin: '0', color: '#ffffff' }}><strong>📋 Title:</strong> {jdPreview.title}</p>
                      <p style={{ margin: '0', color: '#ffffff' }}><strong>⏱️ Experience:</strong> {jdPreview.experience}</p>
                      <p style={{ margin: '0', color: '#ffffff' }}><strong>🛠️ Skills:</strong> {jdPreview.skills}</p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label htmlFor="resume" style={{ color: '#ffffff', display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>📎 Resume Files</label>
                <div style={{ border: '2px dashed #10b981', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: '#000000', transition: 'all 0.3s ease' }}>
                  <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" multiple required onChange={handleResumeUpload} style={{ display: 'none' }} />
                  <label htmlFor="resume" style={{ cursor: 'pointer', color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>📁 Click to upload resume files</label>
                  <p style={{ color: '#cccccc', fontSize: '12px', margin: '5px 0 0 0' }}>Multiple files supported (.pdf, .doc, .docx)</p>
                </div>
                {selectedResumes.length > 0 && (
                  <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#000000', border: '1px solid #10b981', borderRadius: '8px' }}>
                    <h4 style={{ color: '#10b981', margin: '0 0 10px 0', fontSize: '14px', fontWeight: '600' }}>📋 Selected Resume Files ({selectedResumes.length})</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {selectedResumes.map((file, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#10b981', color: '#ffffff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                          <span style={{ marginRight: '8px' }}>📄 {file.name}</span>
                          <button type="button" onClick={() => removeResume(index)} style={{ backgroundColor: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px', padding: '0', marginLeft: '4px', fontWeight: 'bold' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" style={{ width: '100%', height: '50px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }} onMouseEnter={(e) => { e.target.style.backgroundColor = '#0d9668'; e.target.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.target.style.backgroundColor = '#10b981'; e.target.style.transform = 'translateY(0)'; }}>
                🚀 Analyze Resumes
              </button>
            </form>
          </div>
        </div>
      </div>
      {isDuplicateModalOpen && (
        <div id="emailModal" className="modal">
          <div className="modal-content">
            <h3>Duplicate Candidates Detected</h3>
            <p>The following candidates have already been evaluated:</p>
            <ul id="duplicateEmailList">
              {Array.from(duplicateCandidates).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <button
              onClick={() => {
                /* fetchExistingCandidates logic */
              }}
            >
              Fetch Existing Info
            </button>
            <button onClick={() => setIsDuplicateModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}





const EvaluationResultView = ({ result, onBack, selectedRoleInfo, sendCandidateInfoToDB }) => {
  const { content, resumeUrl, hrEmail, rrfId } = result;
  const { ecName } = selectedRoleInfo;

  // Parse content to extract details
  const getDetail = (keyword) => {
    const match = content.match(new RegExp(`${keyword}:\\s*(.*)`));
    return match ? match[1].replace(/\*/g, '').trim() : '';
  };

  const candidateName = getDetail('Full Name');
  const candidateEmail = getDetail('Email');
  const candidatePhone = getDetail('Phone Number');
  const resultSectionText = content.substring(content.indexOf('Result:'));

  let statusText = 'Processing...';
  if (resultSectionText.includes('Shortlisted')) statusText = 'Shortlisted';
  else if (resultSectionText.includes('Rejected')) statusText = 'Rejected';

  const suitabilityMatch = resultSectionText.match(/Suitability Percentage:\s*(\d+)%/);
  const suitabilityPercentage = suitabilityMatch ? suitabilityMatch[1] : '';

  useEffect(() => {
    const recruitmentPhase = statusText.toLowerCase() === 'rejected' ? 'prescreening' : 'Move to L1';

    const candidateDetails = {
      resume: resumeUrl,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      prescreening_status: statusText,
      candidate_phone: candidatePhone,
      role: 'General Position',
      recruitment_phase: recruitmentPhase,
      resume_score: `${suitabilityPercentage}% Matching With JD`,
      hr_email: hrEmail,
      rrf_id: rrfId,
      eng_center: ecName,
      content: content,
    };
    sendCandidateInfoToDB(candidateDetails);
  }, [result, sendCandidateInfoToDB, candidateName, candidateEmail, candidatePhone, content, ecName, hrEmail, resumeUrl, rrfId, statusText, suitabilityPercentage]);

  const downloadContentAsFile = (textContent, candidateName, statusText) => {
    const doc = new jspdf.jsPDF();
    doc.text(textContent, 10, 10);
    const fileName = `${candidateName.trim()}_Resume_Analysis.pdf`;
    doc.save(fileName);
  };

  const sections = [
    { title: 'Candidate Overview', keyword: 'Candidate Overview' },
    { title: 'Contact Information', keyword: 'Contact Information' },
    { title: 'Education', keyword: 'Education' },
    { title: 'Work Experience', keyword: 'Work Experience' },
    { title: 'Skills', keyword: 'Skills' },
    { title: 'Candidate Stability', keyword: 'Candidate Stability' },
    { title: 'Skill Gaps', keyword: 'Skill Gaps' },
    { title: 'Result', keyword: 'Result' },
  ];

  const parsedSections = sections
    .map((section, index) => {
      const startIndex = content.indexOf(section.keyword);
      if (startIndex === -1) return null;

      const nextIndex = index < sections.length - 1 ? content.indexOf(sections[index + 1].keyword, startIndex) : content.length;
      const sectionContent = content.substring(startIndex, nextIndex).replace(section.keyword, '').replace(/[#*:]/g, '').trim();

      return { title: section.title, content: sectionContent };
    })
    .filter(Boolean);

  return (
    <div id="evaluation-result-container" className="cards-container" style={{ marginTop: '55px' }}>
      {parsedSections.map(({ title, content }) => (
        <div key={title} className="card">
          <h2>
            {title}
            {title === 'Result' && (
              <span style={{ color: statusText === 'Shortlisted' ? 'green' : 'red' }}>
                - {statusText} ({suitabilityPercentage}% Matching)
              </span>
            )}
          </h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
        </div>
      ))}
      <div className="feedback-container">
        <button className="download-btn" onClick={() => downloadContentAsFile(content, candidateName, statusText)}>
          <i className="fas fa-download"></i> Download Feedback
        </button>
        {statusText === 'Shortlisted' && (
          <button className="next-btn" onClick={() => (window.location.href = 'prescreeningform.html')}>
            Next
          </button>
        )}
        <div className="back-button-wrapper">
          <button className="back-btnss" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppRecruit;
