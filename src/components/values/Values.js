import React from "react";
import { MainTitle } from "../mainTitle/MainTitle";
import "./values.css";

export const Values = () => {
  return (
    <div id="values" className="values">
      <MainTitle title={"Values"} />
      <div className="values-container">
        <div className="card card-1">
          <p className="card-title">Educational Excellence</p>
          <p className="small-desc">
            Deliver high-quality content to enhance critical thinking.
          </p>
        </div>
        <div className="card card-2">
          <p className="card-title">User Engagement</p>
          <p className="small-desc">
            Make math learning enjoyable and interactive.
          </p>
        </div>
        <div className="card card-3">
          <p className="card-title">Inclusivity</p>
          <p className="small-desc">
            Welcome users of all skill levels and backgrounds.
          </p>
        </div>
        <div className="card card-4">
          <p className="card-title">Continuous Improvement</p>
          <p className="small-desc">
            Enhance our platform based on feedback and technology.
          </p>
        </div>
        <div className="card card-5">
          <p className="card-title">Passion for Learning</p>
          <p className="small-desc">
            Foster a love for math through fun and stimulating challenges.
          </p>
        </div>
        <div className="card card-6">
          <p className="card-title">Innovative Learning Tools</p>
          <p className="small-desc">
            Utilize cutting-edge technology to enrich the learning experience.
          </p>
        </div>
      </div>
    </div>
  );
};
