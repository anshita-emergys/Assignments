import React, { useState } from 'react'
import NavBar from '@components/navbar/NavBar';
import { Outlet } from 'react-router';
import './userDashboard.css'

const UserDashboard = () => {
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

export default UserDashboard