import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchDoctors, deleteDoctor, addDoctor} from "@redux/thunks/admin";
import { MdDelete, MdAdd } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import InputField from "@src/components/inputField/InputField";
import "./doctorList.style.css";
import { DialogContentText } from "@mui/material";
import EmptyState from "@src/components/emptyState/EmptyState";
import noRecords from "@src/assets/no-records.png";

const defaultDoctor = {
  specialization: "",
      email: "",
      doctorInTime: "10:00",
      doctorOutTime: "17:00",
      user_password: "",
      first_name: "",
      last_name: "",
      contact_number: "",
}

const DoctorList = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: defaultDoctor,
  });

  const loadDoctors = async () => {
    try {
      const response = await dispatch(fetchDoctors());
      if (response.error) {
        console.error(response.error);
        return;
      }
      setDoctors(response.payload.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      const saveData = {
        ...data,
        doctorInTime: data.doctorInTime + ":00",
        doctorOutTime: data.doctorOutTime + ":00",
      };
      await dispatch(addDoctor(saveData));
      await loadDoctors();
      setAddDialogOpen(false);
      reset(defaultDoctor);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteClick = (doctorId) => {
    setDoctorToDelete(doctorId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteDoctor(doctorToDelete));
      await loadDoctors();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDoctorToDelete(null);
  };

  return (
    <div className="doctor-list-container">
      <div className="doctor-list-table">
        <div className="doctor-table-header">
          <h3 className="table-title">Doctor List</h3>
          <button
            className="add-doctor-button"
            onClick={() => {
              setAddDialogOpen(true);
              reset();
            }}
          >
            <MdAdd/> Add Doctor
          </button>
        </div>

        <div className="table-content">
          <div className="table-header-row">
            <div className="header-cell">Name</div>
            <div className="header-cell">Specialty</div>
            <div className="header-cell">In Time</div>
            <div className="header-cell">Out Time</div>
            <div className="header-cell">Actions</div>
          </div>

          <div className="doctor-table-rows">
            {doctors?.length > 0 ? (
              doctors.map((doctor) => (
                <div className="table-data-row" key={doctor.doctor_id}>
                  <div className="data-cell">{doctor.name}</div>
                  <div className="data-cell">
                    {doctor.specialty || doctor.specialization}
                  </div>
                  <div className="data-cell">
                    {doctor.in_time || doctor.doctorInTime}
                  </div>
                  <div className="data-cell">
                    {doctor.out_time || doctor.doctorOutTime}
                  </div>
                  <div className="data-cell">
                    <button
                      onClick={() => handleDeleteClick(doctor.doctor_id)}
                      className="delete-button"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                img={noRecords}
                text={"No doctors available in this system"}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Doctor</DialogTitle>
        <DialogContent>
          <form id="add-doctor-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="fullname">
                      <InputField
                        label="First Name"
                        id="first_name"
                        type="text"
                        maxLength={20}
                        register={register}
                        errors={errors}
                        trigger={trigger}
                      />
            
                      <InputField
                        label="Last Name"
                        id="last_name"
                        type="text"
                        maxLength={20}
                        register={register}
                        errors={errors}
                        trigger={trigger}
                      />
                    </div>
            <InputField
              label="Specialization"
              id="specialization"
              type="text"
              register={register}
              errors={errors}
              required
              maxLength={50}
            />
            <InputField
                        label="Email"
                        id="email"
                        type="text"
                        maxLength={50}
                        register={register}
                        errors={errors}
                        trigger={trigger}
                      />
            {/* <div className="input-field">
              <label htmlFor="email">Email</label>
              <select
                id="email"
                {...register("email", { required: "Email is required" })}
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)} 
              >
                <option value="" disabled>Select Email</option>
                {emailList?.map((email) => (
                  <option key={email.id} value={email.id}>
                    {email.email} 
                  </option>
                ))}
              </select>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div> */}
             <InputField
                      label="Mobile Number"
                      id="contact_number"
                      type="text"
                      maxLength={10}
                      register={register}
                      errors={errors}
                      trigger={trigger}
                    />
          <InputField
            label="Password"
            id="user_password"
            type="password"
            maxLength={50}
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
                  {...register("doctorInTime", {
                    required: "In Time is required",
                  })}
                  className={`time-picker-input${
                    errors.doctorInTime ? " error" : ""
                  }`}
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
                />
                {errors.doctorOutTime && (
                  <p className="error-message">
                    {errors.doctorOutTime.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ color: "var(--secondary)" }}
            onClick={() => setAddDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            form="add-doctor-form"
            type="submit"
            color="primary"
            disabled={!isValid}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this doctor? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button color="error" autoFocus onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoctorList;
