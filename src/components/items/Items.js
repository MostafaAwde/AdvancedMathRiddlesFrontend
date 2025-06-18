import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { TfiLock } from "react-icons/tfi";
import { useApiRequest } from "../../hooks/useApiRequest";
import urls from "../../services/apiUrls";
import { Hint } from "../hint/Hint";
import "./items.css";
import { DashboardContext } from "../../pages/dashboard/Dashboard";

export const Items = ({ currentItems }) => {
  const { sendRequest } = useApiRequest();
  const { isCorrectAnswer, setIsCorrectAnswer, userLevel, setUserLevel } =
    useContext(DashboardContext);
  const answerCache = useRef({});
  const [activeOverlayIndex, setActiveOverlayIndex] = useState(
    Object.fromEntries(
      Object.keys(currentItems)
        .slice(0, -1)
        .map((_, index) => [`riddle${index + 1}`, null])
    )
  );

  const [showHints, setShowHints] = useState(
    Object.fromEntries(Object.keys(currentItems).fill((key) => [key, false]))
  );
  const [hintMessages, setHintMessages] = useState(
    Object.fromEntries(Object.keys(currentItems).map((key) => [key, ""]))
  );

  const itemsPerPage = 8;
  const initialPage = Math.floor((userLevel - 1) / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const inputRefs = useRef({});
  const modalRef = useRef(null);

  const handleShowHint = (riddleKey) => {
    setShowHints((prevHints) => ({
      ...prevHints,
      [riddleKey]: !prevHints[riddleKey],
    }));
    setHintMessages((prevMessages) => ({
      ...prevMessages,
      [riddleKey]: currentItems[riddleKey]?.hint || "No hint",
    }));
  };

  useEffect(() => {
    const initialActiveIndexes = {};
    const filteredItems = Object.keys(currentItems).slice(0, -1);
    filteredItems.forEach((key, index) => {
      const riddleKey = `riddle${index + 1}`;
      initialActiveIndexes[riddleKey] =
        index < userLevel - 1 ? riddleKey : null;
    });
    setActiveOverlayIndex(initialActiveIndexes);
  }, [userLevel, currentItems]);

  const playSound = (soundFile) => {
    const audio = new Audio(`/sounds/${soundFile}`);
    audio.play();
  };

  const checkAnswer = useCallback(
    async (riddleKey, level) => {
      const handleAnswerResponse = (response, riddleKey, level) => {
        if (response.data.enteredAnswer) {
          inputRefs.current[riddleKey].value = "";
          setIsCorrectAnswer(true);
          playSound("correct-answer.mp3");
          if (parseInt(userLevel) === parseInt(level)) {
            const newLevel = parseInt(level) + 1;
            setUserLevel(newLevel);
            localStorage.setItem("userLevel", newLevel);
            const newPage = Math.floor((newLevel - 1) / itemsPerPage);
            if (newPage !== currentPage) {
              setCurrentPage(newPage);
            }
          }
        } else {
          playSound("wrong-answer.mp3");
        }
      };
      const userAnswer = inputRefs.current[riddleKey]?.value;
      if (!userAnswer) return;
      if (answerCache.current[riddleKey]?.userAnswer === userAnswer) {
        handleAnswerResponse(
          answerCache.current[riddleKey].response,
          riddleKey,
          level
        );
        return;
      }
      try {
        const sendData = {
          userAnswer: userAnswer,
          riddleLevel: parseInt(level),
        };
        const response = await sendRequest(
          urls.riddles.checkAnswer,
          sendData,
          true
        );
        answerCache.current[riddleKey] = { userAnswer, response };
        handleAnswerResponse(response, riddleKey, level);
        console.log("answerCache ", answerCache);
      } catch (err) {
        console.error("Error checking answer:", err);
        playSound("wrong-answer.mp3");
      }
    },
    [sendRequest, currentPage, setIsCorrectAnswer, userLevel, setUserLevel]
  );

  useEffect(() => {
    if (isCorrectAnswer && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isCorrectAnswer]);

  const handleInputChange = (riddleKey, e) => {
    e.preventDefault();
    const value = e.target.value.replace(/[^0-9./-]/g, "");
    inputRefs.current[riddleKey].value = value;
  };

  const handleOverlayClick = (riddleKey) => {
    setActiveOverlayIndex((prevIndexes) => ({
      ...prevIndexes,
      [riddleKey]: prevIndexes[riddleKey] === riddleKey ? null : riddleKey,
    }));
  };

  return (
    <>
      {currentItems.map((item, index) => {
        const riddleKey = `riddle${index + 1}`;
        const isUnlocked = item.riddle?.level <= userLevel;
        return isUnlocked ? (
          <div
            key={riddleKey}
            onClick={() =>
              item.riddle.level < userLevel &&
              activeOverlayIndex[riddleKey] === riddleKey &&
              handleOverlayClick(riddleKey)
            }
            className={
              item.riddle.level < userLevel &&
              activeOverlayIndex[riddleKey] === riddleKey
                ? "overlay"
                : "riddle"
            }
          >
            {item.riddle.level < userLevel &&
            activeOverlayIndex[riddleKey] === riddleKey ? (
              <p>{item.riddle.level}</p>
            ) : (
              <>
                <Hint
                  key={riddleKey}
                  index={riddleKey}
                  pageIndex={currentPage}
                  showHint={showHints[riddleKey]}
                  onShowHint={() => handleShowHint(riddleKey)}
                  hintMessage={hintMessages[riddleKey]}
                />

                <img
                  id="riddleImage"
                  alt="Riddle"
                  className="riddleImage"
                  src={item.riddle.image_url}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOverlayClick(riddleKey);
                  }}
                />

                <input
                  id={`answer-${riddleKey}`}
                  name={`answer-${riddleKey}`}
                  type="text"
                  ref={(el) => (inputRefs.current[riddleKey] = el)}
                  onChange={(e) => handleInputChange(riddleKey, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (inputRefs.current[riddleKey].value.length !== 0) {
                        checkAnswer(riddleKey, item.riddle.level);
                      }
                    }
                  }}
                />
                <FaLongArrowAltRight
                  className="arrow-icon"
                  onClick={() =>
                    inputRefs.current[riddleKey].value.length !== 0 &&
                    checkAnswer(riddleKey, item.riddle.level)
                  }
                />
              </>
            )}
          </div>
        ) : (
          <div key={riddleKey} className="lock-container">
            <div className="lock-background">
              <TfiLock className="lock" />
            </div>
          </div>
        );
      })}
    </>
  );
};
