import React from 'react'
import { HiOutlineLightBulb } from "react-icons/hi";
import sayingNoImage from "../../assets/sayingNo1.png";
import './hint.css';

export const Hint = ({ index, pageIndex, showHint, onShowHint, hintMessage }) => {
  return (
    <div key={index} className="hint-container">
      <div key={index} className="hintIcon-container">
        <HiOutlineLightBulb
          className="hintIcon"
          key={index}
          onClick={() => onShowHint(index, pageIndex)}
        />
      </div>
      <div className="hint-content">
        {showHint && (
          <p className={`hintText ${showHint ? "show" : "hide"}`}>
            {hintMessage}
          </p>
        )}
        {showHint && hintMessage === "No hint" ? (
          <>
            <img
              src={sayingNoImage}
              alt="No hint available"
              className="no-hint-image"
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  )
}
