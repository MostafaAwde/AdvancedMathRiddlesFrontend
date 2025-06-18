import { useState, useEffect, useRef, useContext, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown, MdReorder } from "react-icons/md";
import { Footer } from "../../components/footer/Footer";
import "./dashboard.css";
import Authentication from "../../components/authentication/Authentication";
import { AuthContext } from "../../context/AuthProvider";
import { useApiRequest } from "../../hooks/useApiRequest";
import { CorrectAnswerModal } from "../../components/correctAnswerModal/CorrectAnswerModal";
import urls from "../../services/apiUrls";
import { PaginatedItems } from "../../components/paginatedItems/PaginatedItems";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [userLevel, setUserLevel] = useState(
    parseInt(localStorage.getItem("userLevel")) || 1
  );

  return (
    <DashboardContext.Provider
      value={{ isCorrectAnswer, setIsCorrectAnswer, userLevel, setUserLevel }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

const Dashboard = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const { loading, sendRequest } = useApiRequest();
  const userLevel = parseInt(localStorage.getItem("userLevel")) || 1;
  const navigate = useNavigate();
  const [showArrow, setShowArrow] = useState(false);
  const [expandNavbar, setExpandNavbar] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [topPlayers, setTopPlayers] = useState([]);
  const username = localStorage.getItem("username");
  const overlayRef = useRef(null);
  const topPlayersRef = useRef(null);

  useEffect(() => {
    const cleanUpRecaptcha = () => {
      const badges = document.querySelectorAll(".grecaptcha-badge");
      badges.forEach((badge) => badge.remove());
      const script = document.getElementById("recaptcha-enterprise-script");
      if (script) {
        document.body.removeChild(script);
      }
      if (window.grecaptcha) {
        delete window.grecaptcha;
      }
    };

    cleanUpRecaptcha();

    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target) &&
        !topPlayersRef.current.contains(event.target)
      ) {
        setShowOverlay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      cleanUpRecaptcha();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 400) {
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight - 80,
      behavior: "smooth",
    });
  };

  const handleLogout = async () => {
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
  };

  const fetchTopPlayers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    if (showOverlay) {
      setShowOverlay(false);
      return;
    }
    setShowOverlay(true);
    const response = await sendRequest(
      urls.dashboard.getTopPlayers,
      {},
      true,
      "GET"
    );

    const { topPlayers } = response.data;
    setTopPlayers(topPlayers);
  };

  return (
    <div className="dashboard">
      <nav className="navbar" id={expandNavbar ? "open" : undefined}>
        <div className="container">
          <p className="username">
            {username} - Level: {userLevel}
          </p>
          <div className="toggleButtonLogin">
            <button
              onClick={() => {
                setExpandNavbar((prev) => !prev);
              }}
            >
              <MdReorder />
            </button>
          </div>
          <ul className="main-nav">
            <li>
              <Link to="/manageAccount">Manage Account</Link>
            </li>
            <li>
              <Link onClick={fetchTopPlayers} ref={topPlayersRef}>
                Top Players
              </Link>
              {showOverlay && (
                <div
                  className={`top-players-overlay ${loading ? "show" : ""}`}
                  ref={overlayRef}
                >
                  {loading ? (
                    <div className="loader"></div>
                  ) : (
                    <div className="topPlayersBox">
                      <h1>Highest Level Players</h1>
                      <ul>
                        {topPlayers.map((player, index) => (
                          <li
                            key={index}
                            className={index === 0 ? "crown" : ""}
                          >
                            {player.username} - {player.level}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </li>
            <li className="btnLogout">
              <Link onClick={handleLogout}>Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="content">
        <DashboardProvider>
          <div className="riddles">
            <CorrectAnswerModal />
          </div>
          <div className="paginationContainer">
            <PaginatedItems />
          </div>
        </DashboardProvider>
      </div>
      {showArrow && (
        <div className="arrow" onClick={scrollToBottom}>
          <MdKeyboardArrowDown />
        </div>
      )}
      <Footer />
    </div>
  );
};

const AuthenticateDashboard = Authentication(Dashboard);
export default AuthenticateDashboard;
