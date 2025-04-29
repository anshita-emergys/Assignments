import { useEffect, useState } from "react";
import img from "@src/assets/no-patients.png";
import { Link, Navigate, useNavigate } from "react-router";
import { FaHeartbeat, FaTint } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import "./patientCard.style.css";
import { fetchPatients, getPersonalInfo } from "@src/redux/thunks/patient";

const PatientCard = () => {
  const {patients, step, patientId} = useSelector((state) => state.patient);
  const { adminMessage, doctorMessage } = useSelector((state) => state.auth);
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPatients());
    const fetchPendingPatient = async () => {
    if(step && patientId){
      const response = await dispatch(getPersonalInfo(patientId));
      setPatient(response.payload.data[0].patient_name);
    }
  }
  fetchPendingPatient();
  }, []);

  return (
    <>
      <div className="header">
        <h2>Patient Records</h2>
        <div className="pending-patient">
        <p>{ patient &&  `Please complete the registration process of ${patient} <IoIosArrowRoundForward />`}</p>  
        <button
          className="add-patient-btn"
          onClick={() =>
            adminMessage
              ? navigate("/admin/add-patient")
              : doctorMessage
              ? navigate("/doctor/add-patient")
              : navigate("/user/add-patient") 
          }
        >
{patient ? "Resume Process" : "Add Patient"}
          {/* Add Patient */}
        </button>
        </div>
      </div>

      {patients?.length > 0 ? (
        <div className="patient-grid">
          {patients?.map((patient) => (
            <div key={patient.patient_id} className="patient-card">
              <div className="profile-section">
                <h4>{patient.patient_name}</h4>
                <span className="country">{patient.country_of_origin}</span>
              </div>
              <div className="patient-details">
                <p className="card-title">
                  The patient is {patient.age} years old, weighing{" "}
                  {patient.weight} kg and standing at a height of{" "}
                  {patient.height} ft. Their BMI is {patient.bmi.toFixed(2)},
                  and they have been diagnosed with {patient.disease_type}.
                </p>
              </div>
              <div className="health-indicators">
                {patient.is_diabetic ? (
                  <p className="alert diabetic">
                    <FaTint className="card-icon" /> Diabetic
                  </p>
                ) : null}
                {patient.cardiac_issue ? (
                  <p className="alert cardiac">
                    <FaHeartbeat className="card-icon" /> Cardiac
                  </p>
                ) : null}
                {patient.blood_pressure ? (
                  <p className="alert bp">
                    <FaHeartbeat className="card-icon" /> Blood Pressure
                  </p>
                ) : null}
              </div>
              <div className="card-actions">
                {!patient.appointment_status ||
                patient.appointment_status === "Completed" ||
                patient.appointment_status === "Cancelled" ? (
                  <button
                    className="book-btn"
                    onClick={() =>
                      navigate(`book-appointment/${patient.patient_id}`)
                    }
                  >
                    Book Appointment
                  </button>
                ) : (
                  <span className={`appointment-${patient.appointment_status}`}>
                    {`Appointment ${patient.appointment_status}`}
                  </span>
                )}

                <Link
                  to={
                    adminMessage
                      ? `/admin/patient-details/${patient.patient_id}`
                      : `/user/patient-details/${patient.patient_id}`
                  }
                  className="view-details"
                >
                  View Details <IoIosArrowRoundForward className="arrow-icon" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-patients">
          <img src={img} alt="No Patients" />
        </div>
      )}
    </>
  );
};

export default PatientCard;
