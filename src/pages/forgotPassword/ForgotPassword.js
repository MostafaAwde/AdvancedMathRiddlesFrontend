import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import urls from "../../services/apiUrls";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.css";
import { useApiRequest } from "../../hooks/useApiRequest";

const override = {
  display: "block",
  margin: "15px auto",
  borderColor: "white",
  width: "30px",
  height: "30px",
};

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { sendRequest, loading } = useApiRequest();

  const [responseMessage, setResponseMessage] = useState("");

  const [disableButton, setDisableButton] = useState(false);

  const [emailPassReset, setEmailPassReset] = useState({
    email: "",
  });

  const handleEmailChange = (e) => {
    setEmailPassReset({ ...emailPassReset, [e.target.name]: e.target.value });
  };

  const handleEmailSubmit = async (e) => {
    setDisableButton(true);
    setResponseMessage("");
    e.preventDefault();
    const sendData = {
      email: emailPassReset.email,
    };

    try {
      const response = await sendRequest(
        urls.forgotPassword.sendPasswordReset,
        sendData,
				false,
        "POST"
      );
      if (response.status === 200 && response.data.msg) {
        const msg = response.data.msg;
        setResponseMessage(msg);
      } else {
        setResponseMessage("Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setDisableButton(false);
  };

  return (
    <div className="forgotPassword">
      <p onClick={() => navigate("/")} className="title">
        Advanced Math Riddles
      </p>

      <p>
        Enter your user account's verified email address and we will send you a
        password reset link.
      </p>
      <form method="POST" onSubmit={handleEmailSubmit}>
        <input name="email" onChange={handleEmailChange} placeholder="Email" />
        <button disabled={disableButton}>Send</button>
      </form>
      {loading && (
        <ClipLoader
          className="spinner"
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
      <p className="responseMessage">{responseMessage}</p>
    </div>
  );
};
