import React, { useState } from "react";
import { NavLink } from "react-router";
import EditProfile from "./EditProfile";
import '@pages/userPage/userDashboard.css';
import '@pages/authPage/authPage.css'
import DeleteAccount from "./DeleteAccount";
import { LuUserCog } from "react-icons/lu";
import { MdOutlineModeEdit, MdOutlineNoAccounts } from "react-icons/md";
import "./adminSettings.css";
import ChangeAdmin from "./ChangeAdmin";
import { useSelector } from "react-redux";

const AdminSettings = () => {
  const superAdmin = useSelector((state) => state.auth.superAdmin);
  const [activeTab, setActiveTab] = useState("edit-profile");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-settings">
      <div className="sidebar">
        <h2>Admin Settings</h2>
        <ul>
          <li>
            <NavLink
              onClick={() => handleTabChange("edit-profile")}
              className={
                activeTab === "edit-profile" ? "tab-active" : "sidebar-link"
              }
            >
              <MdOutlineModeEdit /> Edit Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => handleTabChange("change-admin")}
              className={
                activeTab === "change-admin" ? "tab-active" : "sidebar-link"
              }
            >
              <LuUserCog /> Change Admin
            </NavLink>
          </li>
          {!superAdmin && (
            <li>
              <NavLink
                onClick={() => handleTabChange("delete-account")}
                className={
                  activeTab === "delete-account" ? "tab-active" : "sidebar-link"
                }
              >
                <MdOutlineNoAccounts />
                Delete Account
              </NavLink>
            </li>
          )}
        </ul>
      </div>
      <div className="main-content">
        {activeTab === "edit-profile" && <EditProfile />}
        {activeTab === "change-admin" && <ChangeAdmin />}
        {activeTab === "delete-account" && <DeleteAccount />}
      </div>
    </div>
  );
};

export default AdminSettings;
