import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { registerUser, updateUser } from "../../redux/thunks/user";
import InputField from "../../components/inputField/InputField";
import PropTypes from "prop-types";

const SignupForm = ({ isEditMode, userData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm({});

  useEffect(() => {
    if (isEditMode) {
      reset(userData);
    }
  }, [isEditMode, userData, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        const updateData = {
          first_name: data.first_name,
          last_name: data.last_name,
          mobile_number: data.mobile_number,
        };
        const action = await dispatch(updateUser(updateData));
        if (action.error) {
          toast.error(action.payload);
        } else {
          toast.success("Profile updated successfully!");
        }
      } else {
        setloading(true);
        if (data.user_password) {
          data.user_password = btoa(data.user_password);
        }
        const action = await dispatch(registerUser(data));
        if (action.error) {
          toast.error(action.payload);
        } else {
          toast.success("Signup successful! Please login to continue.");
          navigate("/login");
        }
        setloading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-cont">
      <form onSubmit={handleSubmit(onSubmit)} className="authForm">
        {isEditMode ? <h1>Edit Profile</h1> : <h1>Signup</h1>}
        <div className="fullname">
          <InputField
            label="First Name"
            id="first_name"
            type="text"
            maxLength={20}
            register={register}
            errors={errors}
            trigger={trigger}
          />

          <InputField
            label="Last Name"
            id="last_name"
            type="text"
            maxLength={20}
            register={register}
            errors={errors}
            trigger={trigger}
          />
        </div>

        {!isEditMode && (
          <InputField
            label="Email"
            id="email"
            type="text"
            maxLength={50}
            register={register}
            errors={errors}
            trigger={trigger}
          />
        )}

        <InputField
          label="Mobile Number"
          id="mobile_number"
          type="text"
          maxLength={10}
          register={register}
          errors={errors}
          trigger={trigger}
        />

        {!isEditMode && (
          <InputField
            label="Password"
            id="user_password"
            type="password"
            maxLength={50}
            register={register}
            errors={errors}
            trigger={trigger}
          />
        )}

        {isEditMode ? (
          <button type="submit">Update Profile</button>
        ) : (
          <button type="submit" disabled={loading}>
            {loading ? "Signing" : "Signup"}
          </button>
        )}
      </form>

      {!isEditMode && (
        <div className="toggle">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

SignupForm.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  userData: PropTypes.object,
};

export default SignupForm;
