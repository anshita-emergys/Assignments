import React, { useState, useEffect } from "react";
import ReusableTable from "@src/components/reusableTable/ReusableTable";
import doctor from "@src/assets/doctor-gt.png";
import "./doctorTable.style.css";
import { getUser } from "@src/redux/thunks/user";
import { useDispatch } from "react-redux";
import PrescriptionModal from "../prescription/PrescriptionModal";
import noAppointmentsImg from "@src/assets/no-appointments.png";
import EmptyState from "@src/components/emptyState/EmptyState";
import {
  addPrescription,
  updatePrescription,
  doctorAppointments,
} from "@src/redux/thunks/doctor";
import { toast } from "react-toastify";

const DoctorTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [doctorName, setDoctorName] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appResponse = await dispatch(doctorAppointments()).unwrap();
        setAppointments(appResponse.data);

        const response = await dispatch(getUser());
        setDoctorName(response.payload.data[0].first_name);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAppointments();
  }, [dispatch]);

  const handleAddPrescription = (index) => {
    const appointment = appointments[index];
    setSelectedAppointmentId(appointment.appointment_id);
    setOpen(true);
  };

  const handleSubmitPrescription = async (prescriptionData) => {
    try {
      setLoadingMap((prev) => ({
        ...prev,
        [selectedAppointmentId]: true,
      }));
      let response;

      if (prescriptionData.prescription_id) {
        response = await dispatch(
          updatePrescription(prescriptionData)
        ).unwrap();
      } else {
        response = await dispatch(addPrescription(prescriptionData)).unwrap();
      }

      toast.success(response.message);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoadingMap((prev) => ({
        ...prev,
        [selectedAppointmentId]: false,
      }));
    }
  };

  return (
    <div className="doctor-management-container">
      <div className="doctor-greetings">
        <h3>Hello, Dr. {doctorName}</h3>
        <p>How can we assist you today? </p>
        <img src={doctor} alt="" />
      </div>
      <div className="doctor-table-container">
        <h3>Appointments</h3>
        {appointments.length === 0 ? (
          <EmptyState
            img={noAppointmentsImg}
            text={"No appointments scheduled yet"}
          />
        ) : (
          <ReusableTable
            data={appointments}
            onActionClick={handleAddPrescription}
            loading={loadingMap}
          />
        )}
      </div>
      <PrescriptionModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmitPrescription}
        appointment_id={selectedAppointmentId}
      />
    </div>
  );
};

export default DoctorTable;
