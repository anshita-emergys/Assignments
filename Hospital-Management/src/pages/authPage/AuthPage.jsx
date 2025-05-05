import React, { createContext, useState } from "react";
import { Outlet } from "react-router";
import img from "@src/assets/graphic.png";
import './authPage.css'

export const EmailContext = createContext();

const AuthPage = () => {
  const [email, setEmail] = useState("");

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      <div className="img-auth">
        <div className="auth-container">
          <Outlet />
        </div>
        <img src={img} alt="" />
      </div>
    </EmailContext.Provider>
  );
};

export default AuthPage;
