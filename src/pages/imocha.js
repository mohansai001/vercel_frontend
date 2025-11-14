import React, { useState, useEffect } from 'react';
import './imocha.css';







const ImochaPage = () => {
  const [evaluationData, setEvaluationData] = useState(null);
  const [globalRrfId, setGlobalRrfId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [stepName, setStepName] = useState('');
  const [stepPosition, setStepPosition] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [rounds, setRounds] = useState([
    { recruitment_rounds: "Resume Pre-screen", round_order: 1 },
    { recruitment_rounds: "Online iMocha", round_order: 2 },
    { recruitment_rounds: "L2 Technical", round_order: 3 },
    { recruitment_rounds: "Fitment", round_order: 4 }
  ]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 4000);
  };



  const sendEmailInvite = async () => {
    const sendButton = document.querySelector(".send-email-btn");
    if (sendButton) {
      sendButton.textContent = "Sending...";
      sendButton.disabled = true;
    }

    // Save rounds to DB first
    await saveRoundsToDB();

    const evaluationData = JSON.parse(sessionStorage.getItem("currentCandidate"));
  
    if (!evaluationData) {
      showToast("No candidate details found.", "error");
      if (sendButton) {
        sendButton.textContent = "Send Exam Invite";
        sendButton.disabled = false;
      }
      return;
    }
  
    const { candidate_name, candidate_email, role, hr_email } = evaluationData;
  
    const roleToInviteIdMap = {
      "Junior Azure DevOps Engineer": 1292765,
      "Senior Azure DevOps Engineer": 1292976,
      "Junior AWS DevOps Engineer": 1292733,
      "Senior AWS DevOps Engineer": 1292950,
      "Junior Azure Platform Engineer": 1292775,
      "Junior AWS Platform Engineer": 1292769,
      "Senior AWS Platform Engineer": 1292990,
      "Lead AWS Platform Engineer": 1295883,
      "Junior Azure Cloudops Engineer": 1292781,
      "Junior AWS Cloudops Engineer": 1292779,
      "AWS Data Engineer": 1303946,
      "Azure Data Engineer": 1293813,
      "Databricks Data Engineer": 1293971,
      "Hadoop Data Engineer": 1263132,
      "DataStage Data Engineer": 1304065,
      "IBM MDM Data Engineer": 1233151,
      "ETL Data Engineer": 1294495,
      "Oracle Data Engineer": 1302835,
      "IDMC Data Engineer": 1294495,
      "Marklogic Data Engineer": 1304066,
      "SQL Data Engineer": 1304100,
      "Snowflake Data Engineer": 1292173,
      "SSIS Data Engineer": 1293822,
      "Power BI Data – BI Visualization Engineer": 1303985,
      "Tableau Data – BI Visualization Engineer": 1303999,
      "WebFOCUS Data – BI Visualization Engineer": 1304109,
      "DataAnalyst": 1304111,
      "Data Modeller": 1304149,
      "Junior .Net Cloud Native Application Engineer - Backend": 1304441,
      "Senior .Net Cloud Native Application Engineer - Backend": 1228695,
      "Junior Java Cloud Native Application Engineer - Backend": 1302022,
      "Senior Java Cloud Native Application Engineer - Backend": 1228712,
      "Junior Angular Cloud Native Application Engineer - Frontend": 1228715,
      "Senior Angular Cloud Native Application Engineer - Frontend": 1228781,
      "Junior React Cloud Native Application Engineer - Frontend": 1288123,
      "Senior React Cloud Native Application Engineer - Frontend": 1228853,
      "Junior Mendix LCNC Platform Engineer": 1229987,
      "Senior Mendix LCNC Platform Engineer": 1229987,
    };
  
    const inviteId = roleToInviteIdMap[role];
    if (!inviteId) {
      showToast("Invalid role selected. Please check the role.", "error");
      if (sendButton) {
        sendButton.textContent = "Send Exam Invite";
        sendButton.disabled = false;
      }
      return;
    }

    const targetUrl = `http://localhost:3001/api/invite-candidate`;
  
    const requestData = {
      email: candidate_email,
      name: candidate_name,
      sendEmail: "yes",
      callbackURL: "https://www.imocha.io/",
      redirectURL: "https://www.imocha.io/",
      disableMandatoryFields: 0,
      hideInstruction: 0,
      ccEmail: hr_email,
    };
  
    try {
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestData,
          inviteId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      showToast("Invite sent successfully.", "success");
      if (sendButton) {
        sendButton.textContent = "Invite Sent";
      }
  
      setTimeout(() => {
        window.location.href = "candidates";
      }, 3000);
    } catch (error) {
      console.error("❌ Error sending invite:", error);
      showToast("Failed to send invite request. Please try again.", "error");
      if (sendButton) {
        sendButton.textContent = "Send Exam Invite";
        sendButton.disabled = false;
      }
    }
  };
  
  const skipEmailInvite = async () => {
    if (!evaluationData?.candidate_email) {
      showToast("Candidate email not found.", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Save rounds to DB first
      await saveRoundsToDB();

      const recruitmentPhase = "No iMocha Exam";
      
      const response = await fetch('http://localhost:3001/api/update-candidate-recruitment-phase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidate_email: evaluationData.candidate_email,
          recruitment_phase: recruitmentPhase
        })
      });
      
      const data = await response.json();
      if (data.success) {
        showToast("Skipping iMocha exam", "success");
        setTimeout(() => {
          window.location.href = "/candidates";
        }, 3000);
      } else {
        showToast("Error updating recruitment phase", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Error updating recruitment phase", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const saveRoundsToDB = async () => {
    if (!globalRrfId) {
      showToast("RRF ID not found", "error");
      return;
    }

    const roundsToSave = rounds.map(round => ({
      rrf_id: globalRrfId,
      recruitment_rounds: round.recruitment_rounds,
      round_order: round.round_order
    }));

    try {
      const response = await fetch("http://localhost:3001/api/saveRounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rounds: roundsToSave }),
      });
      
      const data = await response.json();
      if (data.success) {
        console.log("Rounds saved successfully");
      } else {
        console.log("Error saving rounds:", data.message);
      }
    } catch (error) {
      console.error("Error saving rounds:", error);
    }
  };

  const fetchRoundsFromDB = async (rrfId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/getRounds?rrf_id=${rrfId}`);
      const data = await response.json();
      
      if (data.success && data.rounds.length > 0) {
        // If rounds exist in DB, use them
        setRounds(data.rounds);
      } else {
        // If no rounds in DB, use default rounds and save them
        await saveRoundsToDB();
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
    }
  };

  const openFeedbackFormPopup = (round) => {
    console.log("Opening feedback form for round:", round);
  };

  const closePopupForm = () => {
    setShowPopup(false);
  };

  const handleSaveStep = () => {
    if (!stepName || !stepPosition) return;
  
    const newStep = { recruitment_rounds: stepName };
    let updatedRounds = [...rounds];
  
    const lastIndex = updatedRounds.length - 1;
  
    if (stepPosition === 'before') {
      // Always insert before the last round
      updatedRounds.splice(lastIndex, 0, newStep);
    } else if (stepPosition === 'after') {
      // Add after the last round (i.e., append to end)
      updatedRounds.push(newStep);
    }
  
    setRounds(updatedRounds);
    setShowPopup(false);
  };

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("currentCandidate"));
    if (data) {
      setEvaluationData(data);
      setGlobalRrfId(data.rrf_id);

      // Update all candidate name elements
      const candidateNameElements = document.querySelectorAll(".candidateName");
      const cleanName = data.candidate_name ? data.candidate_name.replace(/\s*\([^)]*\)/g, '').trim() : '';
      candidateNameElements.forEach((element) => {
        element.innerText = cleanName;
        if (element.tagName === 'INPUT') {
          element.value = cleanName;
        }
      });

      // Update all candidate email elements
      const candidateEmailElements = document.querySelectorAll(".candidateEmail");
      candidateEmailElements.forEach((element) => {
        element.innerText = data.candidate_email;
        if (element.tagName === 'INPUT') {
          element.value = data.candidate_email;
        }
      });

      // Update other fields
      document.getElementById("statusText").innerText = data.prescreening_status || '';
      document.getElementById("role").innerText = data.role || '';
      const cleanContent = data.content ? data.content.split("- Recommendation:")[0].trim().replace(/\*\*/g, '') : '';
      document.getElementById("finalSummary").innerText = cleanContent;
      document.getElementById("globalHrEmail").innerText = data.hr_email || '';
      document.getElementById("globalRrfId").innerText = data.rrf_id || '';

      // Update phone number elements
      const candidatePhoneNumberElements = document.querySelectorAll(".candidatePhoneNumber");
      candidatePhoneNumberElements.forEach((element) => {
        element.innerText = data.candidate_phone || '';
        if (element.tagName === 'INPUT') {
          element.value = data.candidate_phone || '';
        }
      });

      // Update suitability percentage
      const suitabilityElements = document.querySelectorAll(".suitabilityPercentage");
      suitabilityElements.forEach((element) => {
        element.innerText = data.resume_score || '';
      });

      // Fetch rounds if rrf_id is present
      if (data.rrf_id) {
        fetchRoundsFromDB(data.rrf_id);
      }
    }
  }, []);

  return (
    <div>

      

      <div className="progress-steps">
        
        <div className="steps-container">
          {rounds.map((round, index) => (
            <div 
              key={index} 
              className={`step ${index < 1 ? 'active' : ''}`}
              onClick={index >= 2 ? () => openFeedbackFormPopup(round) : null}
            >
              <div className="step-circle">{index + 1}</div>
              <div className="step-title">{round.recruitment_rounds}</div>
            </div>
          ))}
        </div>
        <div className="add-step-button">
          <button id="addStepButton" onClick={() => setShowPopup(true)}>+</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-form" style={{ display: 'flex' }}>
          <div className="popup-content">
            <h3>Add New Step</h3>
            <label htmlFor="name">Select Step:</label>
            <select 
              id="name" 
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="EC Fitment">EC Fitment</option>
              <option value="Project Fitment">Project Fitment</option>
              <option value="Client Fitment">Client Fitment</option>
            </select>
            <label htmlFor="position">Position:</label>
            <select 
              id="position" 
              value={stepPosition}
              onChange={(e) => setStepPosition(e.target.value)}
            >
              <option value="">Select position</option>
              <option value="before">Before Fitment Round</option>
              <option value="after">After Fitment Round</option>
            </select>
            <button id="saveButton" onClick={handleSaveStep}>Save</button>
            <button id="closeButton" onClick={closePopupForm}>Close</button>
          </div>
        </div>
      )}

      <div className="container">
        <div className="header">
          <div className="profile-info">
            <div className="profile-details">
              <h2 className="candidateName"></h2>
            </div>
          </div>
          <div className="buttons">
            <button className="send-email-btn" onClick={sendEmailInvite}>Send Exam Invite</button>
            <button className="skip-email-btn" onClick={skipEmailInvite}>Skip iMocha Exam</button>
          </div>
        </div>

        <div className="main-content">
          <div className="left-panel">
            <div className="interview-card">
              <div>
                <h4>Candidate Summary</h4>
                <p><span id="finalSummary" style={{ color: '#343a40' }}></span></p>
              </div>
            </div>
            <div className="interview-card">
              <div>
                <h4>HR Details</h4>
                <p style={{ marginBottom: '5px', marginTop: '10px' }}>
                  <span style={{ color: '#343a40' }}>Hr Email:</span>
                  <span id="globalHrEmail" style={{ color: '#343a40' }}></span>
                </p>
                <p>
                  <span style={{ color: '#343a40' }}>RRF ID:</span>
                  <span id="globalRrfId" style={{ color: '#343a40' }}></span>
                </p>
              </div>
            </div>

          </div>

          <div className="right-panel">
            <div className="sidebar-section">
              <h4>Candidate Details</h4>
              <ul>
                <li><span>Name:</span> <span className="candidateName"></span></li>
                <li><span>Email:</span> <span className="candidateEmail"></span></li>
                <li><span>Status:</span> <span id="statusText"></span></li>
                <li><span>Role:</span> <span id="role"></span></li>
                <li><span>Phone:</span> <span className="candidatePhoneNumber"></span></li>
                <li><span>Percentage:</span><span className="suitabilityPercentage"></span></li>
              </ul>
            </div>
          </div>
        </div>

        {toast.show && (
          <div id="toast" className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
        
        <div className={`loading-overlay ${isLoading ? 'show' : ''}`}>
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">Please wait, skipping iMocha exam...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImochaPage;
