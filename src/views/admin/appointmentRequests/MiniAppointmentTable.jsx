import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./appointmentTable.css";
import formatDate from "@src/utils/formatDate";
import { fetchAppointments } from "@src/redux/thunks/admin";

const MiniAppointmentTable = () => {
  const dispatch = useDispatch();
  const { appointmentRequests = [] } = useSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, []);

  return (
    <div className="appointment-table">
      <h3>Appointments</h3>
      <div className="appointment-table-container">
        {appointmentRequests.length > 0 ? (
          appointmentRequests.map((appointment) => (
            <div className="appointment-table-item" key={appointment.appointment_id}>
              <span>{appointment.patient_name}</span>
              {/* <span>{appointment.doctor_name}</span> */}
              {/* <span>{appointment.appointment_time}</span> */}
              <span>{formatDate(appointment.appointment_date,appointment.appointment_time)}</span>
              <span className={`status-tag status-${appointment.status.toLowerCase()}`}>{appointment.status}</span>
            </div>
          ))
        ) : (
          <div className="appointment-table-item">
            <span>No appointments available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniAppointmentTable;