import React, { useRef, useEffect, useContext } from "react";
import "./correctAnswerModal.css";
import { DashboardContext } from "../../pages/dashboard/Dashboard";

export const CorrectAnswerModal = () => {
  const { isCorrectAnswer, setIsCorrectAnswer } = useContext(DashboardContext);
  const modalRef = useRef(null);
  const closeModal = () => {
    setIsCorrectAnswer(false);
  };

  useEffect(() => {
    if (isCorrectAnswer && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isCorrectAnswer]);

  return (
    <>
      {isCorrectAnswer && (
        <div
          className={`modal visible `}
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              closeModal();
            }
          }}
          tabIndex="0"
          ref={modalRef}
        >
          <div className="modal-content">
            <p>Correct Answer!</p>
          </div>
        </div>
      )}
    </>
  );
};
