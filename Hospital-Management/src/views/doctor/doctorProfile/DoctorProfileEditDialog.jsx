import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import InputField from "@src/components/inputField/InputField";
import { useForm } from "react-hook-form";

const DoctorProfileEditDialog = ({ open, onClose, onSave, doctorData }) => {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      specialization: "",
      contact_number: "",
      doctorInTime: "10:00",
      doctorOutTime: "17:00",
    },
  });

  useEffect(() => {
    if (doctorData) {
      reset({
        name: doctorData.doctorName || "",
        specialization: doctorData.specialization || doctorData.specialty || "",
        contact_number: doctorData.contact_number || "",
        doctorInTime: doctorData.doctorInTime
          ? doctorData.doctorInTime.substring(0, 5)
          : "10:00",
        doctorOutTime: doctorData.doctorOutTime
          ? doctorData.doctorOutTime.substring(0, 5)
          : "17:00",
      });
    }
  }, [doctorData, reset]);

  const onSubmit = (data) => {
    const saveData = {
      ...data,
      doctorInTime: data.doctorInTime + ":00",
      doctorOutTime: data.doctorOutTime + ":00",
    };
    onSave(saveData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent className="edit-dialog">
        <InputField
          label="Full Name"
          id="name"
          type="text"
          register={register}
          errors={errors}
          trigger={trigger}
          maxLength={50}
        />
        <InputField
          label="Specialization"
          id="specialization"
          type="text"
          register={register}
          errors={errors}
          trigger={trigger}
          maxLength={50}
        />
        <InputField
          label="Contact Number"
          id="contact_number"
          type="text"
          maxLength={10}
          register={register}
          errors={errors}
          trigger={trigger}
        />

        <div className="time-picker-container">
          <div className="time-picker-field">
            <label htmlFor="doctorInTime" className="time-picker-label">
              In Time
            </label>
            <input
              id="doctorInTime"
              type="time"
              {...register("doctorInTime", { required: "In Time is required" })}
              className={`time-picker-input${
                errors.doctorInTime ? " error" : ""
              }`}
              style={{ padding: "0.5rem", width: "100%" }}
            />
            {errors.doctorInTime && (
              <p className="error-message">{errors.doctorInTime.message}</p>
            )}
          </div>
          <div className="time-picker-field">
            <label htmlFor="doctorOutTime" className="time-picker-label">
              Out Time
            </label>
            <input
              id="doctorOutTime"
              type="time"
              {...register("doctorOutTime", {
                required: "Out Time is required",
              })}
              className={`time-picker-input${
                errors.doctorOutTime ? " error" : ""
              }`}
              style={{ padding: "0.5rem", width: "100%" }}
            />
            {errors.doctorOutTime && (
              <p className="error-message">{errors.doctorOutTime.message}</p>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "var(--secondary)" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          color="primary"
          disabled={!isValid}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DoctorProfileEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  doctorData: PropTypes.object,
};

export default DoctorProfileEditDialog;
