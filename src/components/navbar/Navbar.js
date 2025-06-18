import React, { useState, useEffect } from "react";
import { MdReorder } from "react-icons/md";
import { Link } from "react-router-dom";
import "./navbar.css";

export const Navbar = () => {
  const [expandNavbar, setExpandNavbar] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        setScrollDirection("down");
      } else {
        // Scrolling up
        setScrollDirection("up");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div
        className={`header ${scrollDirection === "down" ? "hide" : ""}`}
        id={expandNavbar && scrollDirection !== 'down' ? "open" : "close"}
      >
        <div className="container">
          <a className="title" href="/">
            Advanced Math Riddles
          </a>
          <div className="toggleButton">
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
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#features">Features</a>
            </li>
            <li>
              <a href="#values">Values</a>
            </li>
            <li>
              <Link to="/signupLogin">Signup/Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
