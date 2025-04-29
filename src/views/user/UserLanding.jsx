import React from 'react'
import graphic from "../../assets/user-landing.png";
import { useNavigate } from 'react-router';

const UserLanding = () => {
    const navigate = useNavigate();

  return (
    <div className="home-container">
    <div className='home-message'>
     <h1>Caring for Patients, One Record at a Time</h1>
     <p>Seamlessly manage medical histories and ensure the best care for your patients</p>
     <button className="add-patient-btn"
              onClick={() => navigate("add-patient")}>Add Patient</button>
    </div>
    
    <img src={graphic} alt="landing page" />
  </div>
  )
}

export default UserLanding