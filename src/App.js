import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { SignupLogin } from "./pages/signupLogin/SignupLogin";
import AuthenticateDashboard from "./pages/dashboard/Dashboard";
import { ForgotPassword } from "./pages/forgotPassword/ForgotPassword";
import { PasswordReset } from "./pages/passwordReset/PasswordReset";
import { ActivateAccount } from "./pages/activateAccount/ActivateAccount";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/home/Home";
import { About } from "./components/about/About";
import { Features } from "./components/features/Features";
import { Values } from "./components/values/Values";
import { Footer } from "./components/footer/Footer";
import AuthenticateManageAccount from "./pages/manageAccount/ManageAccount";
import { AuthContext } from "./context/AuthProvider";
import "./App.css";
import urls from "./services/apiUrls";
import { useApiRequest } from "./hooks/useApiRequest";

function App() {
  const { setIsAuthenticated, isAuthenticated, loading } =
    useContext(AuthContext);
  const { sendRequest } = useApiRequest();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await sendRequest(urls.app.validateToken, {}, true, "GET");
        if (response?.data?.valid === true) {
          setIsAuthenticated(true);
        } else {
          localStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Token validation failed", err);
        localStorage.clear();
        setIsAuthenticated(false);
      } finally {
      }
    };

    validateToken();
  }, [sendRequest, setIsAuthenticated]);

  const ConditionalNavbar = () => {
    const location = useLocation();
    if (location.pathname === "/" && !isAuthenticated) {
      return <Navbar />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <>
                <Home />
                <About />
                <Features />
                <Values />
                <Footer />
              </>
            )
          }
        />
        <Route
          path="/signupLogin"
          element={
            !isAuthenticated ? <SignupLogin /> : <Navigate to="/dashboard" />
          }
        />
        <Route path="/dashboard" element={<AuthenticateDashboard />} />
        <Route
          path="/forgotPassword"
          element={
            !isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />
          }
        />
        <Route path="/manageAccount" element={<AuthenticateManageAccount />} />
        <Route path="/passwordReset/:token" element={<PasswordReset />} />
        <Route path="/activateAccount/:token" element={<ActivateAccount />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;
