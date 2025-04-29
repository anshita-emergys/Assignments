import NavBar from '@src/components/navbar/NavBar';
import React, { useState } from 'react'
import { Outlet } from 'react-router';

const DoctorDashboard = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
      };
    
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".profile-icon")) {
          setShowDropdown(false);
        }
      };
  return (
    <div className="dashboard" onClick={handleOutsideClick}>
        <NavBar showDropdown= {showDropdown} handleDropdown={handleDropdown} />
        <Outlet />
    </div>
  )
}

export default DoctorDashboard