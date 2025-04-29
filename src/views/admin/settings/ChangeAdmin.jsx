import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAdmin, removeAdmin, getAdmin } from "@redux/thunks/admin";
import { MdClose } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import InputField from "@src/components/inputField/InputField";
import "./adminSettings.css";
import "@views/admin/doctorList/doctorList.style.css";

const ChangeAdmin = () => {
  const dispatch = useDispatch();
  const [adminList, setAdminList] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const responseAdmin = await dispatch(getAdmin());
        setAdminList(responseAdmin.payload?.data || []);
      } catch {
        toast.error("Failed to fetch admins");
        setAdminList([]);
      }
    };

    fetchAdmins();
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(addAdmin(data));
      toast.success("Admin privileges added successfully!");
      setAddDialogOpen(false);
      reset();
      const responseAdmin = await dispatch(getAdmin());
      setAdminList(responseAdmin.payload?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add admin");
    }
  };

  const handleDeleteClick = (email) => {
    setAdminToDelete(email);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await dispatch(removeAdmin(adminToDelete));
      if (response.error) {
        toast.error(response.payload);
      } else {
        toast.success("Admin privileges removed successfully!");
        const responseAdmin = await dispatch(getAdmin());
        setAdminList(responseAdmin.payload?.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove admin");
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAdminToDelete(null);
  };

  return (
    <div className="doctor-list-container">
      <div className="doctor-list-table">
        <div className="doctor-table-header">
          <h3 className="table-title">Admins</h3>
          <button
            className="add-doctor-button"
            onClick={() => setAddDialogOpen(true)}
          >
            + Add Admin
          </button>
        </div>

        <div className="table-content">
          <div className="table-header-row">
            <div className="header-cell">Name</div>
            <div className="header-cell">Email</div>
            <div className="header-cell">Actions</div>
          </div>

          <div className="doctor-table-rows">
            {adminList.length > 0 ? (
              adminList.map((admin) => (
                <div className="table-data-row" key={admin.email}>
                  <div className="data-cell">
                    {admin.first_name} {admin.last_name}
                  </div>
                  <div className="data-cell">{admin.email}</div>
                  <div className="data-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(admin.email)}
                    >
                      <MdClose />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No admins available</div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <form id="add-admin-form" onSubmit={handleSubmit(onSubmit)}>
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
              label="Email"
              id="email"
              type="text"
              maxLength={50}
              register={register}
              errors={errors}
              trigger={trigger}
            />
            <InputField
              label="Mobile Number"
              id="mobile_number"
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAddDialogOpen(false)}
            sx={{ color: "var(--secondary)" }}
          >
            Cancel
          </Button>
          <Button
            form="add-admin-form"
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
        <DialogTitle id="alert-dialog-title">Confirm Remove Admin</DialogTitle>
        <DialogContent>
          Are you sure you want to remove this admin? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button color="error" autoFocus onClick={handleDeleteConfirm}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChangeAdmin;
