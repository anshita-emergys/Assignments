import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  approveAppointment,
  updateAppointmentStatus,
} from "@redux/slices/appointmentSlice";
import AppointmentCard from "./AppointmentCard";
import "./appointmentRequests.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import noAppointments from "@src/assets/no-appointments.png";
import EmptyState from "@src/components/emptyState/EmptyState";
import { approveAdminAppointment, changeStatus, fetchAppointments} from "@src/redux/thunks/admin";

const AppointmentRequests = () => {
  const [value, setValue] = useState(0);
  const [loadingMap, setLoadingMap] = useState({});
  const dispatch = useDispatch();
  const { appointmentRequests = [] } = useSelector(
    (state) => state.appointment
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
      dispatch(fetchAppointments());
  },[])

  const tabs = [
    // { label: "All", filter: () => true },
    { label: "Requested", filter: (app) => app.status === "Pending" },
    { label: "Scheduled", filter: (app) => app.status === "Scheduled" },
    { label: "Completed", filter: (app) => app.status === "Completed" },
    { label: "Cancelled", filter: (app) => app.status === "Cancelled" },
  ];


  const handleApprove = async (appointmentId) => {
    try {
      setLoadingMap((prev) => ({
        ...prev,
        [appointmentId]: 'Approve',
      }));
      const response = await dispatch(approveAdminAppointment(appointmentId));
      if (!response.error) {
        await dispatch(approveAppointment(appointmentId));
      }
      setLoadingMap((prev) => ({
        ...prev,
        [appointmentId]: '',
      }));
    } catch (error) {
      console.error( error);
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      setLoadingMap((prev) => ({
        ...prev,
        [appointmentId]: 'Mark',
      }));
      const response = await dispatch(changeStatus({appointmentId, status}));

      if (!response.error) {
        await dispatch(
          updateAppointmentStatus({ appointment_id: appointmentId, status })
        );
      }
      
      else{
        console.error(response.error);  
      }
      setLoadingMap((prev) => ({
        ...prev,
        [appointmentId]: '',
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="request-container">
      <Box sx={{}}>
        <h3>Appointment Requests</h3>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="appointment tabs"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        <div className="appointments-list">
          {appointmentRequests &&
          appointmentRequests.filter(tabs[value].filter).length > 0 ? (
            appointmentRequests
              .filter(tabs[value].filter)
              .map((appointment) => (
                <AppointmentCard
                  key={appointment.appointment_id}
                  appointment={appointment}
                  onApprove={handleApprove}
                  onStatusChange={handleStatusChange}
              loading={loadingMap}
                />
              ))
          ) : (
            <EmptyState
              img={noAppointments}
              text={"No appointments available for this tab"}
            />
          )}
        </div>
      </Box>
    </div>
  );
};

export default AppointmentRequests;
