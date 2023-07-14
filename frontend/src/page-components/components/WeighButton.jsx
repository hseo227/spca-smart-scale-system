import React from "react";
import PetsIcon from "@mui/icons-material/Pets";
import "../../css-components/WeighButton.css";

function WeighButton({ onClick, disabled }) {
  return (
    <button
      className={`weigh-button ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}>
      <PetsIcon style={{ marginRight: "8px" }} /> WEIGH
    </button>
  );
}

export default WeighButton;
