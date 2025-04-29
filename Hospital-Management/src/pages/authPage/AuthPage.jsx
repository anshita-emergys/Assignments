import { Outlet } from "react-router";
import img from "@src/assets/graphic.png";
import './authPage.css'

const AuthPage = () => {
    return (
      <div className="img-auth">
        <div className="auth-container">
          <Outlet/>
        </div>
        <img src={img} alt="" />
      </div>
    );
  };
  
  export default AuthPage;