import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IoMdAdd } from "react-icons/io";
import "./prescriptionModal.style.css";

const createNewMedicine = () => ({
  name: "",
  capacity: "",
  dosage: "",
  courseDuration: "",
  timing: {
    beforeMeal: { morning: false, afternoon: false, evening: false },
    afterMeal: { morning: false, afternoon: false, evening: false },
  },
});

const PrescriptionModal = ({ open, onClose, onSubmit, appointment_id }) => {
  const [medicines, setMedicines] = useState([createNewMedicine()]);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [courseDuration, setCourseDuration] = useState("");
  const [error,setError] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleTimingChange = (index, type, timeOfDay) => {
    const updated = [...medicines];
    updated[index].timing[type][timeOfDay] =
      !updated[index].timing[type][timeOfDay];
    setMedicines(updated);
  };

  const addMedicine = () => {
    const newIndex = medicines.length;
    setMedicines([...medicines, createNewMedicine()]);
    setExpandedIndex(newIndex);
  };

  const removeMedicine = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const getTimingString = (med, timeOfDay) => {
    const before = med.timing.beforeMeal[timeOfDay];
    const after = med.timing.afterMeal[timeOfDay];
    if (before && after) return "both";
    if (before) return "before meal";
    if (after) return "after meal";
    return "false";
  };

  const handleSubmit = () => {
    const isValid = medicines.every((m) => m.name && m.dosage && courseDuration);
    if (!isValid) {
      setError("Please fill out all the details of medicine.");
      return;
    }

    const transformed = {
      appointment_id: appointment_id,
      medicines: medicines.map((med) => med.name),
      capacity: medicines.map((med) => med.capacity),
      dosage: medicines.map((med) => med.dosage),
      morning: medicines.map((med) => getTimingString(med, "morning")),
      afternoon: medicines.map((med) => getTimingString(med, "afternoon")),
      evening: medicines.map((med) => getTimingString(med, "evening")),
      courseDuration: Number(courseDuration),
    };

    onSubmit(transformed);
    setMedicines([createNewMedicine()]);
    setCourseDuration("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Prescription</DialogTitle>
      <DialogContent>
        <div className="medicine-list">
          {medicines.map((med, index) => (
            <Accordion
              key={index}
              expanded={expandedIndex === index}
              onChange={() => setExpandedIndex(index)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
              >
                <strong className="medicine-error">Medicine {index + 1}</strong> {error &&  <p className="auth-error">{error}</p> }
              </AccordionSummary>
              <AccordionDetails>
                <div className="medicine-card">
                  <div className="medicine-inputs">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      value={med.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Capacity (e.g., 250mg)"
                      value={med.capacity}
                      onChange={(e) =>
                        handleChange(index, "capacity", e.target.value)
                      }
                    />

                    <input
                      type="text"
                      placeholder="Dosage (e.g., 1 tablet)"
                      value={med.dosage}
                      onChange={(e) =>
                        handleChange(index, "dosage", e.target.value)
                      }
                    />
                  </div>
                  <div className="course-duration-input">
                    <label htmlFor="courseDuration">
                      Course Duration (days):{" "}
                    </label>
                    <input
                      type="number"
                      id="courseDuration"
                      min="1"
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      placeholder="Enter course duration"
                    />
                  </div>
                  <div className="medicine-checks">
                    <p>Before Meal:</p>
                    <div className="checkbox-group">
                      {["morning", "afternoon", "evening"].map((time) => (
                        <FormControlLabel
                          key={`before-${time}`}
                          control={
                            <Checkbox
                              checked={med.timing.beforeMeal[time]}
                              onChange={() =>
                                handleTimingChange(index, "beforeMeal", time)
                              }
                            />
                          }
                          label={time}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="medicine-checks">
                    <p>After Meal:</p>
                    <div className="checkbox-group">
                      {["morning", "afternoon", "evening"].map((time) => (
                        <FormControlLabel
                          key={`after-${time}`}
                          control={
                            <Checkbox
                              checked={med.timing.afterMeal[time]}
                              onChange={() =>
                                handleTimingChange(index, "afterMeal", time)
                              }
                            />
                          }
                          label={time}
                        />
                      ))}
                    </div>
                  </div>

                  {index > 0 && (
                    <button
                      className="remove-btn"
                      onClick={() => removeMedicine(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>

        <button className="medicine-add" onClick={addMedicine}>
          <IoMdAdd className="medicine-i" /> Add Another Medicine
        </button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="#7e7e7e">
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionModal;
