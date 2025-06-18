import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./manageAccount.css";
import Authentication from "../../components/authentication/Authentication";
import { AuthContext } from "../../context/AuthProvider";
import urls from "../../services/apiUrls";
import { useApiRequest } from "../../hooks/useApiRequest";

Modal.setAppElement("#root");

const ManageAccount = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [activeForm, setActiveForm] = useState(null);
  const { sendRequest } = useApiRequest();
  const [passwordData, setPasswordData] = useState({
    existingPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [usernameData, setUsernameData] = useState({
    password: "",
    newUsername: "",
    confirmUsername: "",
  });
  const [deleteData, setDeleteData] = useState({
    password: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formVisibility, setFormVisibility] = useState({
    password: false,
    username: false,
    delete: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const sendData = {
      currentPassword: passwordData.existingPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    };

    try {
      const response = await sendRequest(
        urls.manageAccount.updatePassword,
        sendData,
        true,
        "PUT"
      );
      if (response.status === 200 && response.data.authorized === false) {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate("/");
        return;
      } else if (response.data.success) {
        setSuccessMsg(response.data.success);
        setErrorMsg("");
        setPasswordData({
          existingPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setErrorMsg(response.data.error);
        setSuccessMsg("");
      }
    } catch (error) {
      setErrorMsg("An error occurred while updating password.");
      setSuccessMsg("");
    }
  };

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    const sendData = {
      password: usernameData.password,
      newUsername: usernameData.newUsername,
      confirmUsername: usernameData.confirmUsername,
    };

    try {
      const response = await sendRequest(
        urls.manageAccount.updateUsername,
        sendData,
        true,
        'PUT'
      );
      if (response.status === 200 && response.data.authorized === false) {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate("/");
        return;
      } else if (response.data.success) {
        setSuccessMsg(response.data.success);
        setErrorMsg(""); // Clear any previous error message
        localStorage.setItem("username", usernameData.newUsername);
        setUsernameData({
          // Clear form fields
          password: "",
          newUsername: "",
          confirmUsername: "",
        });
      } else {
        setErrorMsg(response.data.error);
        setSuccessMsg(""); // Clear any previous success message
      }
    } catch (error) {
      setErrorMsg("An error occurred while updating username.");
      setSuccessMsg(""); // Clear any previous success message
    }
  };

  const handleDeleteAccount = async () => {
    const sendData = {
      password: deleteData.password,
    };

    try {
      const response = await sendRequest(
        urls.manageAccount.delete,
        sendData,
        true,
        'DELETE'
      );
      if (response.status === 200 && response.data.authorized === false) {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate("/");
        return;
      } else if (response.data.success) {
        setSuccessMsg(response.data.success);
        setErrorMsg(""); // Clear any previous error message
        localStorage.clear();
        window.location.reload();
      } else {
        setErrorMsg(response.data.error);
        setSuccessMsg(""); // Clear any previous success message
      }
    } catch (error) {
      setErrorMsg("An error occurred while deleting the account.");
      setSuccessMsg(""); // Clear any previous success message
    }
  };

  const handleFormChange = (formType) => {
    setActiveForm((prevForm) => (prevForm === formType ? null : formType));
    setSuccessMsg(""); // Clear success message when switching forms
    setErrorMsg(""); // Clear error message when switching forms

    // Set form visibility with a delay to allow the current form to hide before showing the new one
    setFormVisibility((prevVisibility) => {
      const newVisibility = { ...prevVisibility };
      newVisibility[formType] = !prevVisibility[formType];
      return newVisibility;
    });
  };

  // Use useEffect to handle visibility transitions
  useEffect(() => {
    if (activeForm) {
      const timeoutId = setTimeout(() => {
        setFormVisibility((prevVisibility) => ({
          ...prevVisibility,
          [activeForm]: true,
        }));
      }, 300); // Match with the CSS transition duration

      return () => clearTimeout(timeoutId);
    }
  }, [activeForm]);

  return (
    <div className="manageAccount">
      <div className="container">
        <button
          onClick={() => navigate("/dashboard")}
          className="backToDashboardButton"
        >
          Back to Dashboard
        </button>

        <h1>Manage Account</h1>

        <div className="actionButtons">
          <button onClick={() => handleFormChange("password")}>
            Update Password
          </button>
          <button onClick={() => handleFormChange("username")}>
            Update Username
          </button>
          <button onClick={() => handleFormChange("delete")}>
            Delete Account
          </button>
        </div>

        <div
          className={`manageAccountForm ${
            formVisibility.password ? "visible" : "hidden"
          }`}
        >
          {activeForm === "password" && (
            <form onSubmit={handlePasswordChange}>
              <h3>Update Password</h3>
              <input
                type="password"
                placeholder="Existing Password"
                value={passwordData.existingPassword}
                onClick={() => setErrorMsg("")}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    existingPassword: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onClick={() => setErrorMsg("")}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onClick={() => setErrorMsg("")}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <button type="submit">Update Password</button>
            </form>
          )}
        </div>

        <div
          className={`manageAccountForm ${
            formVisibility.username ? "visible" : "hidden"
          }`}
        >
          {activeForm === "username" && (
            <form onSubmit={handleUsernameChange}>
              <h3>Update Username</h3>
              <input
                type="password"
                placeholder="Password"
                value={usernameData.password}
                onClick={() => setErrorMsg("")}
                onChange={(e) =>
                  setUsernameData({ ...usernameData, password: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="New Username"
                value={usernameData.newUsername}
                onClick={() => setErrorMsg("")}
                onChange={(e) =>
                  setUsernameData({
                    ...usernameData,
                    newUsername: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Confirm New Username"
                value={usernameData.confirmUsername}
                onClick={() => setErrorMsg("")}
                onChange={(e) =>
                  setUsernameData({
                    ...usernameData,
                    confirmUsername: e.target.value,
                  })
                }
              />
              <button type="submit">Update Username</button>
            </form>
          )}
        </div>

        <div
          className={`manageAccountForm ${
            formVisibility.delete ? "visible" : "hidden"
          }`}
        >
          {activeForm === "delete" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (deleteData.password !== "") {
                  setIsModalOpen(true);
                } else {
                  handleDeleteAccount();
                }
              }}
            >
              <h3>Delete Account</h3>
              <input
                onClick={() => setErrorMsg("")}
                type="password"
                placeholder="Enter Your Password"
                value={deleteData.password}
                onChange={(e) =>
                  setDeleteData({
                    ...deleteData,
                    password: e.target.value,
                  })
                }
              />
              <button
                type="submit"
                onClick={() => {
                  if (deleteData.password !== "") {
                    setIsModalOpen(true);
                  } else {
                    handleDeleteAccount();
                  }
                }}
              >
                Delete Account
              </button>
            </form>
          )}
        </div>

        {/* Success and Error Messages */}
        {successMsg && <div className="successMessage">{successMsg}</div>}
        {errorMsg && <div className="errorMessage">{errorMsg}</div>}

        {/* Confirmation Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="deleteModal"
          overlayClassName="deleteModalOverlay"
        >
          <h2>Confirm Account Deletion</h2>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <button
            onClick={() => {
              handleDeleteAccount();
              setIsModalOpen(false);
            }}
          >
            Confirm
          </button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </Modal>
      </div>
    </div>
  );
};

const AuthenticateManageAccount = Authentication(ManageAccount);
export default AuthenticateManageAccount;
