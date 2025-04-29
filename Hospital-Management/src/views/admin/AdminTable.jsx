import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPatients, setCurrentPage } from "@redux/slices/adminSlice";
import { useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Card from "./Card";
import { deletePatientData, getAgeGroup } from "@redux/thunks/admin";
import MiniAppointmentTable from "./appointmentRequests/MiniAppointmentTable";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const AdminTable = () => {
  const dispatch = useDispatch();
  const { adminPatients, pagination } = useSelector((state) => state.admin);
  const [ageGroups, setAgeGroups] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [patientIdToDelete, setPatientIdToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchAgeGroups = async () => {
    try {
      const response = await dispatch(getAgeGroup());
      if (response.error) {
        console.error(response.error);
        return;
      }
      setAgeGroups(response.payload.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAgeGroups();
  }, []);

  useEffect(() => {
    dispatch(fetchAdminPatients(pagination.currentPage));
  }, [dispatch, pagination.currentPage]);

  const handlePageChange = (pageNumber) => {
    dispatch(fetchAdminPatients(pageNumber));
    dispatch(setCurrentPage(pageNumber));
  };

  const handlePatientDelete = (patientId) => {
    setPatientIdToDelete(patientId);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletePatientData(patientIdToDelete));
      dispatch(fetchAdminPatients(pagination.currentPage));
      fetchAgeGroups();
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="admin-container">
      {ageGroups && Object.keys(ageGroups).length > 0 && (
        <div className="age-group-cards">
          {Object.keys(ageGroups).map((ageGroup, index) => (
            <Card key={index} title={ageGroup} count={ageGroups[ageGroup]} />
          ))}
        </div>
      )}
      <div className="admin-dashboard-tables">
        <div className="admin-table">
          <h3>Patient List</h3>
          <div className="table-container">
            <div className="table-header">
              <span>Patient Name</span>
              <span>Gender</span>
              <span>Age</span>
              <span>Disease Type</span>
              <span>Actions</span>
            </div>
            {adminPatients?.length > 0 && (
              <div className="table-body">
                {adminPatients.map((patient) => (
                  <div className="table-row" key={patient.patient_id}>
                    <span>{patient.patient_name}</span>
                    <span>{patient.gender}</span>
                    <span>{patient.age}</span>
                    <span>{patient.disease_type}</span>
                    <span className="actions">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/patient-details/${patient.patient_id}`
                          )
                        }
                        title="view details"
                      >
                        <FaEye className="eye-icon" />
                      </button>
                      <button
                        onClick={() => handlePatientDelete(patient.patient_id)}
                      >
                        <MdDelete className="dlt-icon" />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Prev
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={pagination.currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
        <div className="mini-appointment">
          <MiniAppointmentTable />
        </div>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this patient?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{color :'var(--secondary)' }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} sx={{color :'var(--danger)' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminTable;
