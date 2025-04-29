import React, { useState, useEffect} from "react";
import "./EditProfile.css";
import { useNavigate } from "react-router";
import img from "../../../assets/profile.png";
import Signup from '../../authentication/Signup';
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUser } from "../../../redux/thunks/user";
import { updateToken } from "../../../redux/slices/authSlice";
import DoctorProfileEditDialog from "@src/views/doctor/doctorProfile/DoctorProfileEditDialog";
import { getDoctor, updateDoctor } from "../../../redux/thunks/doctor";

const EditProfile = () => {
  const [userData, setUserData] = useState({});
  const [doctorData, setDoctorData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctorMessage = useSelector(state => state.auth.doctorMessage);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (doctorMessage) {
          const response = await dispatch(getDoctor());
          setDoctorData(response.payload.data[0]);
        } else {
          const response = await dispatch(getUser());
          setUserData(response.payload.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [doctorMessage, dispatch]);

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteUser());
      dispatch(updateToken(null,null));
      navigate("/signup");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = async (updatedData) => {
    try {
      await dispatch(updateDoctor(updatedData));
      setDoctorData(updatedData);
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit-profile-container">
      <img src={img} alt="" />
      <div className="edit-profile-form">
        {doctorMessage ? (
          <div className="edit-dialog">
            <h1>Edit Your Details</h1>
            <p>Need to make changes to your account? Whether it's updating your name, number or other details, you can easily do so by clicking the button below.</p>
            <button onClick={handleDialogOpen} className="update-btn">
              Edit Now
            </button>
            <DoctorProfileEditDialog
              open={dialogOpen}
              onClose={handleDialogClose}
              onSave={handleSave}
              doctorData={doctorData}
            />
          </div>
        ) : (
          <Signup isEditMode={true} userData={userData} />
        )}

        <div className="edit-profile-dlt">
          <h1>Delete Account</h1>
          <p>Deleting your account will result in the permanent loss of all your data, including your medical history, patient records, and any other information associated with your account. This action cannot be undone.</p>
          <button type="button" onClick={handleDeleteAccount} className="delete-btn">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
