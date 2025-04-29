import React, { useEffect, useState } from "react";
import PersonalInfo from "./PersonalInfo";
import "./multiStep.css";
import FamilyInfo from "./FamilyInfo";
import DiseaseInfo from "./Disease";
import DocumentForm from "./DocumentForm";
import { FaHeartbeat, FaUsers } from "react-icons/fa";
import { GiInnerSelf } from "react-icons/gi";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setPatientId, setStep, resetPatientState } from "@redux/slices/patientsSlice";
import { toast } from "react-toastify";
import { IoDocuments } from "react-icons/io5";

const steps = [
  { id: 1, title: "Personal Info", icon: <GiInnerSelf /> },
  { id: 2, title: "Family Info", icon: <FaUsers /> },
  { id: 3, title: "Disease", icon: <FaHeartbeat /> },
  { id: 4, title: "Upload Documents", icon: <IoDocuments /> },
];

const MultiStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { adminMessage } = useSelector((state) => state.auth);

  const { step, patientId } = useSelector((state) => state.patient);
  const [formData, setFormData] = useState({
    personalInfo: {},
    familyInfo: {},
    diseaseInfo: {},
  });

  useEffect(() => {
    if (patientId) {
      dispatch(setPatientId(patientId));
    }
  }, [patientId]);

  const handleNext = async (newData) => {
    if (step === steps.length) {
      dispatch(resetPatientState());
      toast.success("Patient added successfully!");
      adminMessage === 1
        ? navigate("/admin/patients")
        : navigate("/user/patients");
    } else {
      setFormData({ ...formData, ...newData });
      dispatch(setStep(step + 1));
    }
  };

  const handleBack = () => {
    dispatch(setStep(step - 1));
  };

  return (
    <div className="multi-step-container">
      <aside className="step-sidebar">
        <h2>Register Patient Details</h2>
        <p className="subheading">
          Follow the simple 4 steps to complete the process.
        </p>
        <ul>
          {steps.map((s) => (
            <li key={s.id} className={s.id === step ? "active" : ""}>
              <span className="step-icon">{s.icon}</span>
              {s.title}
            </li>
          ))}
        </ul>
      </aside>
      <div className="multi_step">
        {step === 1 && (
          <PersonalInfo
            onNext={handleNext}
            setFormData={setFormData}
            formData={formData.personalInfo}
          />
        )}
        {step === 2 && (
          <FamilyInfo
            onNext={handleNext}
            onBack={handleBack}
            setFormData={setFormData}
            formData={formData.familyInfo}
          />
        )}
        {step === 3 && (
          <DiseaseInfo
            onNext={handleNext}
            onBack={handleBack}
            setFormData={setFormData}
            formData={formData.diseaseInfo}
          />
        )}
        {step === 4 && (
          <DocumentForm
            onNext={handleNext}
            onBack={handleBack}
            setFormData={setFormData}
            formData={formData.diseaseInfo}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStep;
