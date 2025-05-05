import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { updateToken } from "@redux/slices/authSlice";
import { toast } from "react-toastify";
import InputField from "@src/components/inputField/InputField";
import { login } from "@src/redux/thunks/user";
import { jwtDecode } from "jwt-decode";
import { EmailContext } from "../../pages/authPage/AuthPage";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const { email, setEmail } = useContext(EmailContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (data.user_password) {
        data.user_password = btoa(data.user_password);
      }
      const payload = {};
      if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
        payload.email = data.email;
        payload.user_password = data.user_password;
      } else {
        payload.userCode = data.email;
        payload.user_password = data.user_password;
      }

      const response = await dispatch(login(payload));

      if (response.error) {
        toast.error(response.payload);
        setShowForgot(true);
        return;
      }
      const decodedToken = jwtDecode(response.payload.token);

      const adminMessage = decodedToken.admin;
      const doctorMessage = decodedToken.doctor;
      const superAdmin = decodedToken.superAdmin;

      if (adminMessage === 1) {
        dispatch(
          updateToken({
            newToken: response.payload.token,
            adminMessage: adminMessage,
            superAdmin: superAdmin,
          })
        );
        navigate("/admin");
      } else if (doctorMessage === 1) {
        dispatch(
          updateToken({
            newToken: response.payload.token,
            doctorMessage: doctorMessage,
          })
        );
        navigate("/doctor");
      } else {
        dispatch(
          updateToken({ newToken: response.payload.token, adminMessage: null })
        );
        navigate("/user");
      }
      toast.success("Login Successful");
      setShowForgot(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="login-cont">
      <form onSubmit={handleSubmit(onSubmit)} className="authForm">
        <h1>Login</h1>
        <InputField
          label="Email or UserId"
          id="email"
          type="text"
          maxLength={50}
          register={register}
          errors={errors}
          trigger={trigger}
          defaultValue={email}
          onChange={handleEmailChange}
        />
        <InputField
          label="Password"
          id="user_password"
          type="password"
          maxLength={50}
          register={register}
          errors={errors}
          trigger={trigger}
        />
        <div className="toggle">
          <Link to="/forgot-password" className="link">
            {showForgot ? "Forgot Password?" : "   "}
          </Link>
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="toggle">
        Don't have an account?{" "}
        <Link to="/signup" className="link">
          Signup
        </Link>{" "}
      </div>
    </div>
  );
};

export default Login;
