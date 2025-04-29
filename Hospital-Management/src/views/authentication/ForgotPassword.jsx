import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { forgotPassword, resetPassword } from "@redux/thunks/user";
import bcrypt from "bcryptjs";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpFields, setOtpFields] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState(null);
  const [serverOtp, setServerOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    const newOtpFields = [...otpFields];
    newOtpFields[index] = e.target.value;
    setOtpFields(newOtpFields);
    if (e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
    setOtp(newOtpFields.join(""));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const sendOtp = async () => {
    try {
      const hashOtp = await dispatch(forgotPassword(email)).unwrap();
      setIsOtpSent(true);
      setOtpFields(new Array(6).fill(""));
      setServerOtp(hashOtp);
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  const verifyOtp = () => {
    bcrypt.compare(otp, serverOtp, (err, isMatch) => {
      if (isMatch) {
        setIsOtpSent(false);
        setIsOtpVerified(true);
        setError(null);
      } else {
        setError("Invalid OTP");
      }
    });
  };

  const resetPasswordHandler = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await dispatch(resetPassword({ email, newPassword: password })).unwrap();
      toast.success("Password reset successfully");
      navigate("/login");
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="forgot-password">
      {!isOtpSent && !isOtpVerified && (
        <div className="otp-inputs">
          <h2>Forgot Password</h2>
          <p>
            Please enter the registered email address to reset your password.
          </p>
          <div className="input-group">
            <label htmlFor="email">
              {" "}
              Email{" "}
              <span>{error && <p className="auth-error">{error}</p>}</span>{" "}
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="forgot-inputs"
            />
          </div>
          <button onClick={sendOtp}>Send Code</button>
        </div>
      )}
      {isOtpSent && (
        <div className="otp-inputs">
          <h3>Verification</h3>
          <p>Please enter the verification code sent to you</p>
          <div className="otp-fields">
            {otpFields.map((field, index) => (
              <input
                key={index}
                type="number"
                value={field}
                onChange={(e) => handleOtpChange(e, index)}
                maxLength={1}
                className="otp-field"
              />
            ))}
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button onClick={verifyOtp}>Verify</button>
        </div>
      )}
      {isOtpVerified && (
        <div className="otp-inputs">
          <h3>Reset Password</h3>
          <div className="input-group">
            <label htmlFor="password">
              {" "}
              New Password{" "}
              <span>{error && <p className="auth-error">{error}</p>}</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword"> Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button onClick={resetPasswordHandler}>Reset Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
