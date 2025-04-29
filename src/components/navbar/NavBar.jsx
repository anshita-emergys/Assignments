import React from "react";
import { NavLink, useNavigate } from "react-router";
import { SiWorldhealthorganization } from "react-icons/si";
import { FaHome, FaUser, FaCalendarAlt } from "react-icons/fa";
import { RiStethoscopeFill, RiHealthBookFill } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "@redux/slices/authSlice";
import PropTypes from "prop-types";
import "./navBar.style.css";

const NavBar = ({ showDropdown, handleDropdown }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminMessage, doctorMessage } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(clearToken());
  };

  return (
    <nav className="navbar">
      <h2>
        <SiWorldhealthorganization className="icon" />
      </h2>
      <div className="nav-actions">
        <NavLink
          to={adminMessage ? "/admin" : doctorMessage ? '/doctor' : "/user"}
          end
          activeclassname="active"
          className="nav-link"
        >
          <FaHome className="nav-icon" />
          Home
        </NavLink>
        {adminMessage && (
          <NavLink
            to="doctors"
            end
            activeclassname="active"
            className="nav-link"
          >
            <RiStethoscopeFill className="nav-icon" />
            Doctors
          </NavLink>
        )}
        {adminMessage && (
          <NavLink
            to="appointments"
            end
            activeclassname="active"
            className="nav-link"
          >
            <FaCalendarAlt className="nav-icon" />
            Appointments
          </NavLink>
        )}
        <NavLink
          to="patients"
          end
          activeclassname="active"
          className="nav-link"
        >
          <RiHealthBookFill className="nav-icon" />
          Patients
        </NavLink>
        <FaUser
          className="icon  profile-icon"
          onClick={() => handleDropdown()}
        />
        {showDropdown && (
          <div className="dropdown">
            {adminMessage ? (
              <button onClick={() => navigate("/admin/settings")}>
                Settings
              </button>
            ) : doctorMessage ? (
              <button onClick={() => navigate(`/doctor/edit-profile`)}>
                Edit Profile
              </button>
            ): (
              <button onClick={() => navigate(`/user/edit-profile`)}>
                Edit Profile
              </button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  handleDropdown: PropTypes.function,
};

export default NavBar;
