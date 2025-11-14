import React from "react";
import "./ec_selection.css";


const EcSelection = () => {
  // Modified navigateTo to support query params
  const navigateTo = (url, ecName) => {
    if (ecName) {
      window.location.href = `${url}?ec=${encodeURIComponent(ecName)}`;
    } else {
      window.location.href = url;
    }
  };

  return (
    <div>

      {/* Back Button */}
      <div className="backbutton" onClick={() => navigateTo("index")}>
        <i className="fas fa-arrow-left"></i>
      </div>

      {/* Cards Section */}
      <div className="card-container">
        <div className="card disabled">
          <i className="fas fa-cloud card-icon"></i>
          <div className="card-title">Cloud TSC</div>
          <div className="disabled-overlay">Coming Soon</div>
        </div>
        <div
          className="card"
          onClick={() => navigateTo("apprecruit", "App EC")}
        >
          <i className="fas fa-cogs card-icon"></i>
          <div className="card-title">App TSC</div>
        </div>
        <div className="card disabled">
          <i className="fas fa-database card-icon"></i>
          <div className="card-title">Data TSC</div>
          <div className="disabled-overlay">Coming Soon</div>
        </div>
        <div className="card disabled">
          <i className="fas fa-microchip card-icon"></i>
          <div className="card-title">Core TSC</div>
          <div className="disabled-overlay">Coming Soon</div>
        </div>
      </div>
    </div>
  );
};

export default EcSelection;
