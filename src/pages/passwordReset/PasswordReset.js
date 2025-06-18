import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import urls from "../../services/apiUrls";
import "./passwordReset.css";
import { useApiRequest } from "../../hooks/useApiRequest";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
  width: "30px",
  height: "30px",
};

export const PasswordReset = () => {
  const { token } = useParams();
  const { sendRequest, loading } = useApiRequest();

  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const [resetPasswordErrors, setResetPasswordErrors] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = sendRequest(
            urls.passwordReset.get,
            {},
            false,
            "GET"
          );

          if (response.status === 200 && response.data.valid) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setTokenError(response.data.errorMessage);
          }
        } catch (error) {
          console.error("Error during validating token:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    validateToken();
  }, []);

  const handleResetPasswordChange = (e) => {
    setNewPassword({ ...newPassword, [e.target.name]: e.target.value });
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    const sendData = {
      password: newPassword.password,
      confirmPassword: newPassword.confirmPassword,
    };

    try {
      const response = await sendRequest(urls.passwordReset.update, sendData, false, "POST", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.tokenError) {
        setTokenError(response.data.tokenError);
      }

      if (response.data.success !== "") {
        const msg = response.data.success;
        setResetPasswordSuccess(msg);
      } else {
        const msg = response.data.validateMsg;
        setResetPasswordErrors(msg);
      }
    } catch (error) {
      console.error("Error during reset password:", error);
    }
  };

  return (
    <div className="passwordReset">
      {!isAuthenticated ? (
        <p className="error">{tokenError}</p>
      ) : (
        <>
          <h1>Reset Password</h1>

          <form
            className="passwordResetForm"
            method="post"
            onSubmit={handleResetPasswordSubmit}
          >
            <label htmlFor="password">New password</label>
            <input
              onFocus={() => setResetPasswordErrors("")}
              className="newPassword"
              type="password"
              id="password"
              name="password"
              value={newPassword.password}
              onChange={handleResetPasswordChange}
            />

            <label htmlFor="confirmPassword">Repeat password</label>
            <input
              onFocus={() => setResetPasswordErrors("")}
              className="newConfirmPassword"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={newPassword.confirmPassword}
              onChange={handleResetPasswordChange}
            />

            <button>Submit</button>
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

          <div className="error" style={{ marginTop: "15px" }}>
            {resetPasswordErrors}
          </div>
          <div className="success">{resetPasswordSuccess}</div>
        </>
      )}
    </div>
  );
};
