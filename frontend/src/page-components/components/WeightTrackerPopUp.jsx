import React from "react";
import "../../css-components/WeightTrackerPopUp.css";
import WeighButton from "./WeighButton";

function WeightTrackerPopup({ weightData, handleDropdownChange }) {
  function weigh() {
    console.log("weigh");
  }

  return (
    <div className="popup">
      <div>Centre</div>
      <div className="centre">Centre Name</div>
      <div>Select a Scale</div>
      <div className="popup-content">
        <select className="dropdown" onChange={handleDropdownChange}>
          <option value="">Available Scales</option>
          {weightData.map((row, index) => (
            <option key={index} value={row.weight}>
              {row.date}
            </option>
          ))}
        </select>
        <div className="weight-button-container">
          <WeighButton onClick={weigh} />
        </div>
      </div>
    </div>
  );
}

export default WeightTrackerPopup;
