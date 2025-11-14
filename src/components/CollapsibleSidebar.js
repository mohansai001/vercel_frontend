import React, { useState } from 'react';
import './CollapsibleSidebar.css';
import { MdDashboard, MdGroup, MdAssignment, MdList, MdUpload, MdLogout, MdMenu } from 'react-icons/md';

const CollapsibleSidebar = ({ menuItems, onLogout, onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
      
    }
  };

  const handleMenuClick = (item) => {
    if (item.action === 'logout') {
      onLogout();
    } else if (item.path) {
      window.location.href = item.path;
    }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <MdMenu />
      </button>
      <div className={`collapsible-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* <div className="sidebar-header">
          <h3 className={`sidebar-title ${isCollapsed ? 'hidden' : ''}`}>Menu</h3>
        </div> */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="sidebar-item"
              onClick={() => handleMenuClick(item)}
              title={item.name}
            >
              <span className="sidebar-icon">
                {item.icon === 'DashboardIcon' && <MdDashboard />}
                {item.icon === 'GroupIcon' && <MdGroup />}
                {item.icon === 'AssignmentIcon' && <MdAssignment />}
                {item.icon === 'ListAltIcon' && <MdList />}
                {item.icon === 'UploadIcon' && <MdUpload />}
                {item.icon === 'LogoutIcon' && <MdLogout />}
              </span>
              <span className={`sidebar-text ${isCollapsed ? 'hidden' : ''}`}>
                {item.name}
              </span>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default CollapsibleSidebar;