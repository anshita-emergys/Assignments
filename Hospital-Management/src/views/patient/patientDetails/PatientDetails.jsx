import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import "./patientDetails.css";
import "../multiStep/multiStep.css";
import { fetchAdminPatients } from "@redux/slices/adminSlice";
import { fetchPatients, updateDocument } from "@redux/thunks/patient";
import PersonalInfo from "../multiStep/PersonalInfo";
import FamilyInfo from "../multiStep/FamilyInfo";
import DiseaseInfo from "../multiStep/Disease";

const getFileName = (name) => {
  switch (name) {
    case "aadhaarBack":
      return "Aadhaar Front";
    case "aadhaarFront":
      return "Aadhaar Back";
    case "insuranceBack":
      return "Insurance Back";
    case "insuranceFront":
      return "Insurance Front";
  }
};

const PatientDetails = () => {
  const { id } = useParams();
  const { adminMessage } = useSelector((state) => state.auth);
  const { pagination } = useSelector((state) => state.admin);
  const { patients: userPatients } = useSelector((state) => state.patient);
  const { adminPatients } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [patient, setPatient] = useState(
    adminPatients.find((p) => p.patient_id === parseInt(id)) ||
      userPatients.find((p) => p.patient_id === parseInt(id)) ||
      null
  );
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});

  const fetchPatientData = async (force=false) => {
    try {
      const existingPatient =
        adminPatients.find((p) => p.patient_id === parseInt(id)) ||
        userPatients.find((p) => p.patient_id === parseInt(id));
        console.log('force',force);
      if (!force && existingPatient) {
        setPatient(existingPatient);
        return;
      }
      
      
      if (adminMessage) {
        await dispatch(fetchAdminPatients(pagination.currentPage));
      } else {
        await dispatch(fetchPatients());
      }

    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchPatientData();
    const foundPatient =
        adminPatients.find((p) => p.patient_id === parseInt(id)) ||
        userPatients.find((p) => p.patient_id === parseInt(id));

      if (foundPatient) {
        setPatient(foundPatient);
      }
  }, [id, dispatch, adminMessage, pagination.currentPage]);

  useEffect(() => {
    const updatedPatient =
      adminPatients.find((p) => p.patient_id === parseInt(id)) ||
      userPatients.find((p) => p.patient_id === parseInt(id)) ||
      null;
    setPatient(updatedPatient);
  }, [adminPatients, userPatients, id]);

  const handleEdit = (infoType) => {
    setShowEditForm(true);
    setEditFormData({ infoType, ...patient[infoType] });
  };

  const handleUpdateDocument = (document) => {
    setSelectedDocument(document);
    setShowUpdateForm(true);
  };

  const handleUpdateDocumentSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("document_type", selectedDocument.document_type);
    formData.append("file", event.target.file.files[0]);
    formData.append("patient_id", id);

    try {
      const result = await dispatch(updateDocument(formData));
      if (result.error) {
        console.error(result.error);
        return;
      }
      setShowUpdateForm(false);
      if (adminMessage) {
        dispatch(fetchAdminPatients(pagination.currentPage));
      } else {
        dispatch(fetchPatients());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="patient-details-container">
      <div className="patient-details-card">
        <h2>Patient Details</h2>
        <div className="patient-info">
          <div className="section">
            <div className="section-title">
              <h3>Personal Info</h3>
              <div>
                {" "}
                <button onClick={() => handleEdit("personalInfo")}>
                  <FaEdit />
                </button>
              </div>
            </div>
            <p className="detail-item">
              Patient Name: <strong>{patient?.patient_name}</strong>
            </p>
            <p className="detail-item">
              Date of Birth:{" "}
              <strong>{patient?.date_of_birth.split("T")[0]}</strong>
            </p>
            <p className="detail-item">
              Weight: <strong>{patient?.weight} kg</strong>
            </p>
            <p className="detail-item">
              Height: <strong>{(() => {
                const h = Number(patient?.height);
                return isNaN(h) ? patient?.height : h.toFixed(2);
              })()} ft</strong>
            </p>
            <p className="detail-item">
              BMI: <strong>{patient?.bmi.toFixed(2)}</strong>
            </p>
            <p className="detail-item">
              Age: <strong>{patient?.age}</strong>
            </p>
            <p className="detail-item">
              Country of Origin: <strong>{patient?.country_of_origin}</strong>
            </p>
          </div>
          <div className="section">
            <div className="section-title">
              <h3>Family Info</h3>
              <div>
                <button onClick={() => handleEdit("familyInfo")}>
                  <FaEdit />
                </button>
              </div>
            </div>
            <p className="detail-item">
              Father's Name: <strong>{patient?.father_name}</strong>
            </p>
            <p className="detail-item">
              Father's Age: <strong>{patient?.father_age}</strong>
            </p>
            <p className="detail-item">
              Father's Country:{" "}
              <strong>{patient?.father_country_origin}</strong>
            </p>
            <p className="detail-item">
              Mother's Name: <strong>{patient?.mother_name}</strong>
            </p>
            <p className="detail-item">
              Mother's Age: <strong>{patient?.mother_age}</strong>
            </p>
            <p className="detail-item">
              Mother's Country:{" "}
              <strong>{patient?.mother_country_origin}</strong>
            </p>
          </div>
          <div className="section">
            <div className="section-title">
              <h3>Disease Info</h3>
              <div>
                <button onClick={() => handleEdit("diseaseInfo")}>
                  <FaEdit />
                </button>
              </div>
            </div>

            <p className="detail-item">
              Disease Type: <strong>{patient?.disease_type}</strong>
            </p>
            <p className="detail-item">
              Disease Description:{" "}
              <strong>{patient?.disease_description}</strong>
            </p>
          </div>
        </div>
        <div className="details-document">
          <h3>Documents</h3>
          <div className="document">
            {patient?.documents.map((document) => (
              <div
                key={document.document_type}
                className="details-document-item"
              >
                <p>
                  {getFileName(document.document_type)}{" "}
                  <button onClick={() => handleUpdateDocument(document)}>
                    <FaEdit />
                  </button>
                </p>
                <img
                  src={`${import.meta.env.VITE_DOCUMENT_URL}${
                    document.document_url
                  }`}
                />
                {showUpdateForm &&
                  selectedDocument.document_type &&
                  selectedDocument.document_type === document.document_type && (
                    <div className="update-document-form">
                      <form onSubmit={handleUpdateDocumentSubmit}>
                        <input type="file" name="file" />
                        <button type="submit">Update Document</button>
                      </form>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEditForm && (
        <div className="pop-container">
          <div className="edit-form-popup">
            <button
              className="close-btn"
              onClick={() => setShowEditForm(false)}
            >
              &times;
            </button>
            {editFormData.infoType === "personalInfo" && (
              <PersonalInfo
                id={id}
                setShowEditForm={setShowEditForm}
                onUpdate={fetchPatientData}
              />
            )}
            {editFormData.infoType === "familyInfo" && (
              <FamilyInfo
                id={id}
                setShowEditForm={setShowEditForm}
                onUpdate={fetchPatientData}
              />
            )}
            {editFormData.infoType === "diseaseInfo" && (
              <DiseaseInfo
                id={id}
                setShowEditForm={setShowEditForm}
                onUpdate={fetchPatientData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
