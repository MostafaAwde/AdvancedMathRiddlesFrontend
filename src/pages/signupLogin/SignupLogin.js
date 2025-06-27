import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signupLogin.css";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../../context/AuthProvider";
import urls from "../../services/apiUrls";
import { useApiRequest } from "../../hooks/useApiRequest";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
  width: "30px",
  height: "30px",
};

export const SignupLogin = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const { sendRequest, loading } = useApiRequest();
  const navigate = useNavigate();

  const [chkChecked, setChkChecked] = useState(true);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    emailUsername: "",
    password: "",
  });

  // Error messages state
  const [signupErrors, setSignupErrors] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loginErrors, setLoginErrors] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    const scriptId = 'recaptcha-enterprise-script';
    const badgeElementClass = 'grecaptcha-badge';
    
    // Remove any existing badge elements first
    const existingBadges = document.querySelectorAll(`.${badgeElementClass}`);
    existingBadges.forEach(badge => badge.remove());

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6LfFUUQqAAAAAHoTm8JGVjRHvLdr9S55wHmlfIMa';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait for grecaptcha to be fully ready
        const checkRecaptcha = () => {
          if (window.grecaptcha && window.grecaptcha.enterprise && window.grecaptcha.enterprise.execute) {
            setRecaptchaReady(true);
          } else {
            setTimeout(checkRecaptcha, 100);
          }
        };
        checkRecaptcha();
      };

      script.onerror = () => {
        console.error('Failed to load reCAPTCHA');
        setRecaptchaReady(false);
      };

      document.body.appendChild(script);
    } else {
      setRecaptchaReady(true);
    }

    return () => {
      // Clean up when component unmounts
      const script = document.getElementById(scriptId);
      if (script) {
        document.body.removeChild(script);
      }
      
      // Remove badge elements
      const badges = document.querySelectorAll('.grecaptcha-badge');
      badges.forEach(badge => badge.remove());
      
      // Reset grecaptcha if it exists
      if (window.grecaptcha) {
        delete window.grecaptcha;
      }
    };
  }, []);

  const cleanUpRecaptcha = () => {
    // Remove badge elements
    const badges = document.querySelectorAll('.grecaptcha-badge');
    badges.forEach(badge => badge.remove());
    
    // Remove script
    const script = document.getElementById('recaptcha-enterprise-script');
    if (script) {
      document.body.removeChild(script);
    }
    
    // Remove grecaptcha object
    if (window.grecaptcha) {
      delete window.grecaptcha;
    }
  };

  const handleCheckboxChange = () => {
    !signupErrors && setChkChecked(!chkChecked);
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setDisableButton(true);

    if (!recaptchaReady) {
      setSignupErrors("Security verification is loading. Please try again in a moment.");
      setDisableButton(false);
      return;
    }

    try {
      const recaptchaToken = await window.grecaptcha.enterprise.execute(
        "6LfFUUQqAAAAAHoTm8JGVjRHvLdr9S55wHmlfIMa",
        { action: "signup" }
      );

      const sendData = {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        recaptchaToken: recaptchaToken,
      };

      const response = await sendRequest(urls.signupLogin.post, sendData, false, "POST");

      if (response.status === 200 && response.data.success) {
        setSuccessMsg(response.data.success);
      } else {
        const msg = response.data.validateMsg;
        setSignupErrors(msg);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setSignupErrors("Signup process failed. Please try again.");
    }

    setDisableButton(false);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const sendData = {
      emailUsername: loginData.emailUsername,
      password: loginData.password,
    };
    const response = await sendRequest(urls.signupLogin.get, sendData, false, "POST");
    if (response.data.authorized) {
      // Clean up reCAPTCHA before navigation
      cleanUpRecaptcha();

      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userLevel", response.data.level);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(response.data.authorized);
      navigate("/dashboard");
    } else {
      const msg = response.data.validateMsg;
      setLoginErrors(msg);
    }
  };

  return (
    <div
      id="signupLogin"
      className="signupLoginContainer"
      onClick={() => setSuccessMsg("")}
    >
      <a onClick={() => navigate("/")} className="title">
        Advanced Math Riddles
      </a>
      <div className="main">
        <input
          type="checkbox"
          name=""
          id="chk"
          aria-hidden="true"
          checked={chkChecked}
          onChange={handleCheckboxChange}
        />
        <div className="signup">
          <form
            onClick={() => setSignupErrors("") && setLoginErrors("")}
            onSubmit={handleSignupSubmit}
          >
            <label
              aria-hidden="true"
              onClick={chkChecked ? handleCheckboxChange : undefined}
              style={{
                cursor: !chkChecked ? "default" : "pointer",
              }}
            >
              Sign up
            </label>
            <input
              onFocus={() => setSignupErrors("")}
              type="text"
              placeholder="Username"
              name="username"
              value={signupData.username}
              onChange={handleSignupChange}
            />
            <input
              onFocus={() => setSignupErrors("")}
              placeholder="Email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
            />
            <input
              onFocus={() => setSignupErrors("")}
              type="password"
              placeholder="Password"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
            />
            <input
              onFocus={() => setSignupErrors("")}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={signupData.confirmPassword}
              onChange={handleSignupChange}
            />

            <button className="btnSignup" disabled={disableButton || !recaptchaReady}>
              {!recaptchaReady ? "Loading security..." : "Sign up"}
            </button>
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
          <div className="signupLoginError">{signupErrors}</div>
          <div className="signupLoginSuccess">{successMsg}</div>
        </div>
        <div
          className="login"
          style={
            signupErrors || successMsg || loading
              ? { transform: "translateY(100%)" }
              : {}
          }
        >
          <form onSubmit={handleLoginSubmit}>
            <label
              aria-hidden="true"
              onClick={!chkChecked ? handleCheckboxChange : undefined}
              style={{
                cursor: !chkChecked ? "pointer" : "default",
              }}
            >
              Login
            </label>
            <input
              type="text"
              onFocus={() => setLoginErrors("")}
              placeholder="Email / Username"
              name="emailUsername"
              value={loginData.emailUsername}
              onChange={handleLoginChange}
            />
            <input
              onFocus={() => setLoginErrors("")}
              type="password"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
            />
            <button className="btnLogin">Login</button>
          </form>
          <div className="signupLoginError">{loginErrors}</div>
          <Link className="forgotPasswordLink" to={"/forgotPassword"}>
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};