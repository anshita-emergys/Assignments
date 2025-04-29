import React from "react";
import "./formButton.css";

const Button = ({ onBack, hide, isLast, setShowEditForm }) => {
  return (
    <div className="form-btns">
      {hide && (
        <button type="button" className="back-btn" onClick={onBack}>
          Go Back
        </button>
      )}
      <button type="submit" className="next-btn">
        {isLast || setShowEditForm ? "Confirm" : "Next"}
      </button>
    </div>
  );
};

export default Button;
