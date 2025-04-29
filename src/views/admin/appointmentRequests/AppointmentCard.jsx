import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import "./appointmentRequests.css";
import formatDate from "@src/utils/formatDate";
import { useDispatch } from "react-redux";
import { cancelAppointment } from "@src/redux/thunks/admin";
import { updateAppointmentStatus } from "@src/redux/slices/appointmentSlice";

const AppointmentCard = ({ appointment, onApprove, onStatusChange, loading }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const dispatch = useDispatch();
  const [reason,setReason] = useState(null);

  const handleCancelClick = (appointmentId) => {
    console.log('appointment id',appointmentId);
    
    setAppointmentToCancel(appointmentId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); 
    setAppointmentToCancel(null);
  };

  const handleConfirmCancel = async () => {
    if (appointmentToCancel) {
      try {
        const response = await dispatch(cancelAppointment({ appointmentId: appointmentToCancel, reason }));
        setOpenDialog(false);
        setAppointmentToCancel(null);
        if (!response.error) {
          await dispatch(
            updateAppointmentStatus({ appointment_id: appointmentToCancel, status: 'Cancelled' })
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getStatusActions = () => {
    const loadingState = loading && loading[appointment.appointment_id];
    switch (appointment.status) {
      case "Pending":
        return (
          <>
            <button
              className="btn btn-approve"
              onClick={() => onApprove(appointment.appointment_id)}
              disabled={loadingState === "Approve"}
            >
              {loadingState === "Approve" ? "Approving" : "Approve"}
            </button>
            <button
              className="btn btn-cancel"
              onClick={() => handleCancelClick(appointment.appointment_id)}
            >
              {loadingState === "Cancel" ? "Cancelling" : "Cancel"}
            </button>
          </>
        );
      case "Scheduled":
        return (
          <>
            <button
              className="btn btn-complete"
              onClick={() =>
                onStatusChange(appointment.appointment_id, "Completed")
              }
            >
              {loadingState === "Mark" ? "Marking" : "Mark Completed"}
            </button>
            <button
              className="btn btn-cancel"
              onClick={() => handleCancelClick(appointment.appointment_id)}
            >
              {loadingState === "Cancel" ? "Cancelling" : "Cancel"}
            </button>
          </>
        );
      default:
        return null;
    }
  };


  return (
    <div
      className={`appointment-card ${
        appointment.status === "Completed"
          ? "completed-card"
          : appointment.status === "Cancelled"
          ? "cancelled-card"
          : ""
      }`}
    >
      <div className="card-content">
        <div className="row">
          <div>
            <p className="label">Patient name</p>
            <p className="value">{appointment.patient_name}</p>
          </div>
          <div>
            <p className="label">Age</p>
            <p className="value">{appointment.age}</p>
          </div>
        </div>

        <div className="row">
          <div>
            <p className="label">Condition</p>
            <p className="value">{appointment.disease_type}</p>
          </div>
          <div>
            <p className="label">Gender</p>
            <p className="value">{appointment.gender}</p>
          </div>
        </div>

        <div className="row doctor-row">
          <div>
            <p className="label">Doctor name</p>
            <p className="value">{appointment.name}</p>
          </div>
          <div>
            <p className="label">
              {appointment.status === "Pending" ? "Estimation Schedule" : "Scheduled"}
            </p>
            <p className="value">
              {formatDate(appointment.appointment_date, appointment.appointment_time)}
            </p>
          </div>
        </div>

        <div className="appointment-actions">{getStatusActions()}</div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <div className="cancel-confirmation">
          <p>Are you sure you want to cancel this appointment? Please provide a reason below.</p>
          <label htmlFor="reason">Reason for cancellation</label>
          <input id="reason" type="text" value={reason}  onChange={(e) => setReason(e.target.value)} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{color: 'var(--secondary)'}}>
            No
          </Button>
          <Button onClick={handleConfirmCancel} sx={{color: 'var(--danger)'}} disabled={!reason}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AppointmentCard;
