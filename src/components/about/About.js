import React from "react";
import { MainTitle } from "../mainTitle/MainTitle";
import aboutImage from "../../assets/background.jpg";
import "./about.css";

export const About = () => {
  return (
    <div className="about" id="about">
      <MainTitle title={"About"} />
      <div className="heading">
        <p>
          Welcome to Advanced Math Riddles, where we turn math challenges into
          engaging and rewarding experiences! Our platform is designed for
          anyone who loves solving puzzles and improving their mathematical
          skills. We believe in making learning fun and interactive, which is
          why we offer a vast collection of math riddles that cater to various
          skill levels.
        </p>
      </div>
      <div className="container">
        <section className="box">
          <div className="about-image">
            <img src={aboutImage} />
          </div>
          <div className="about-content">
            <h2>Inspire Curiosity With Math</h2>
            <p>
              Our mission is to inspire and engage minds through a series of
              carefully crafted mathematical riddles designed to enhance
              problem-solving skills and promote logical thinking. Whether
              you're a student eager to test your knowledge, a teacher looking
              for a fun and educational tool, or a math enthusiast who loves a
              good challenge, our platform has something for everyone.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
