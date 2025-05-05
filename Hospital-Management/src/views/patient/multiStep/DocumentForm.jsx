import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../../components/formButton/FormButton";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../../redux/thunks/patient";

const DocumentForm = ({ onNext, onBack, formData }) => {
  const patientId = useSelector((state) => state.patient.patientId);
  const [filePreviews, setFilePreviews] = useState({});
  const [fileData, setFileData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm({
    defaultValues: formData,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedImageTypes.includes(file.type)) {
      setError("Only PNG, JPEG, and JPG files are allowed");
      return;
    } else if (file.size > maxSize) {
      setError("File size should not exceed 5MB");
    }
    setFileData((prev) => ({ ...prev, [event.target.name]: file }));
    const fileURL = URL.createObjectURL(file);
    setFilePreviews((prev) => ({ ...prev, [event.target.name]: fileURL }));
  };

  const handleUpload = async (key) => {
    try {
      const file = fileData[key];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", key);
      formData.append("patient_id", patientId);
      const result = await dispatch(uploadFile(formData));
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setUploadedFiles((prev) => ({ ...prev, [key]: true }));
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitDocumentData = (data) => {
    if (
      uploadedFiles.aadhaarFront &&
      uploadedFiles.aadhaarBack
    ) {
      onNext({ documentInfo: data });
    } else {
      toast.error("Please upload all required documents");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitDocumentData)}
      className="patient_form"
    >
      <h2>Document Information</h2>
      <p className="auth-error">{error && `${error}`}</p>
      <div className="document-grid">
        <div className="document-item">
          <label>Aadhaar Card Front *</label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            {...register("aadhaarFront", {
              required: true,
            })}
            onChange={(e) => handleFileChange(e)}
            disabled={uploadedFiles.aadhaarFront}
            required
          />
          {filePreviews.aadhaarFront && (
            <img src={filePreviews.aadhaarFront} alt="Aadhaar front" />
          )}
          <button
            type="button"
            onClick={() => handleUpload("aadhaarFront")}
            disabled={uploadedFiles.aadhaarFront}
          >
            {uploadedFiles.aadhaarFront ? "Uploaded" : "Upload"}
          </button>
        </div>
        <div className="document-item">
          <label>Aadhaar Card Back *</label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            {...register("aadhaarBack", {
              required: true,
            })}
            onChange={(e) => handleFileChange(e)}
            disabled={uploadedFiles.aadhaarBack}
            required
          />
          {filePreviews.aadhaarBack && (
            <img src={filePreviews.aadhaarBack} alt="Aadhaar back" />
          )}

          <button
            type="button"
            onClick={() => handleUpload("aadhaarBack")}
            disabled={uploadedFiles.aadhaarBack}
          >
            {uploadedFiles.aadhaarBack ? "Uploaded" : "Upload"}
          </button>
        </div>
        <div className="document-item">
          <label>Medical Insurance Front</label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            {...register("insuranceFront")}
            onChange={(e) => handleFileChange(e)}
            disabled={uploadedFiles.insuranceFront}
          />
          {filePreviews.insuranceFront && (
            <img src={filePreviews.insuranceFront} alt="Insurance front" />
          )}

          <button
            type="button"
            onClick={() => handleUpload("insuranceFront")}
            disabled={uploadedFiles.insuranceFront}
          >
            {uploadedFiles.insuranceFront ? "Uploaded" : "Upload"}
          </button>
        </div>
        <div className="document-item">
          <label>Medical Insurance Back</label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            {...register("insuranceBack")}
            onChange={(e) => handleFileChange(e)}
            disabled={uploadedFiles.insuranceBack}
          />
          {filePreviews.insuranceBack && (
            <img src={filePreviews.insuranceBack} alt="Insurance back" />
          )}

          <button
            type="button"
            onClick={() => handleUpload("insuranceBack")}
            disabled={uploadedFiles.insuranceBack}
          >
            {uploadedFiles.insuranceBack ? "Uploaded" : "Upload"}
          </button>
        </div>
      </div>
      <Button onBack={onBack} hide={true} isLast={true} />
    </form>
  );
};

export default DocumentForm;
