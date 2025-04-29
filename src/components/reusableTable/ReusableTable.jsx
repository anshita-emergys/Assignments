import React from "react";
import "./table.style.css";
import PropTypes from "prop-types";

const ReusableTable = ({ data, onActionClick, loading }) => {
  const headers = [
    "Patient Name",
    "Age",
    "Appointed For",
    "Date",
    "Time",
    "Prescription",
  ];

  return (
    <div className="table-content">
      <div className="table-header-row">
        {headers.map((header, index) => (
          <div className="header-cell" key={index}>
            {header}
          </div>
        ))}
      </div>

      {data.map((row, index) => {
        const isLoading = loading && loading[row.appointment_id];
        return (
          <div className="table-data-row" key={index}>
            <div className="data-cell">{row.patient_name}</div>
            <div className="data-cell">{row.age}</div>
            <div className="data-cell">{row.disease_types}</div>
            <div className="data-cell">{row.appointment_date ? row.appointment_date.substring(0, 10) : ""}</div>
            <div className="data-cell">{row.appointment_time}</div>
            <button onClick={() => onActionClick(index)} disabled={isLoading}>
              {isLoading ? 'Uploading' : (row.prescription_id ? 'Update' : 'Add')}
            </button>
          </div>
        );
      })}
    </div>
  );
};

ReusableTable.propTypes = {
  data: PropTypes.array,
  onActionClick: PropTypes.func,
};

export default ReusableTable;
