import React from "react";
import { MainTitle } from "../mainTitle/MainTitle";
import "./features..css";

export const Features = () => {
  return (
    <div id="features" className="ag-format-container">
      <MainTitle title={"Features"} />
      <div className="ag-courses_box">
        <div className="ag-courses_item">
          <div className="ag-courses-item_link">
            <div className="ag-courses-item_bg"></div>

            <div className="ag-courses-item_title">Interactive Riddles</div>

            <div className="ag-courses-item_date-box">
              <span className="ag-courses-item_date">
                Enjoy a range of engaging math riddles designed for fun and
                challenge.
              </span>
            </div>
          </div>
        </div>

        <div className="ag-courses_item">
          <div className="ag-courses-item_link">
            <div className="ag-courses-item_bg"></div>

            <div className="ag-courses-item_title">Mathematical Topics</div>

            <div className="ag-courses-item_date-box">
              <span className="ag-courses-item_date">
                Explore puzzles based on topics like derivatives, integrals,
                trigonometry, and more.
              </span>
            </div>
          </div>
        </div>

        <div className="ag-courses_item">
          <div className="ag-courses-item_link">
            <div className="ag-courses-item_bg"></div>

            <div className="ag-courses-item_title">User Progress Tracking</div>

            <div className="ag-courses-item_date-box">
              <span className="ag-courses-item_date">
                Monitor the riddles you've completed and your overall progress.
              </span>
            </div>
          </div>
        </div>

        <div className="ag-courses_item">
          <div className="ag-courses-item_link">
            <div className="ag-courses-item_bg"></div>

            <div className="ag-courses-item_title">
              Highly Interactive Experience
            </div>

            <div className="ag-courses-item_date-box">
              <span className="ag-courses-item_date">
                Enjoy an interactive interface for a smooth riddling experience.
              </span>
            </div>
          </div>
        </div>

        <div className="ag-courses_item">
          <div className="ag-courses-item_link">
            <div className="ag-courses-item_bg"></div>

            <div className="ag-courses-item_title">Leaderboards</div>

            <div className="ag-courses-item_date-box">
              <span className="ag-courses-item_date">
                Compete with others and rise up the leaderboard.
              </span>
            </div>
          </div>
        </div>

        <div className="ag-courses_item">
          <div className="ag-courses-item_link">
            <div className="ag-courses-item_bg"></div>

            <div className="ag-courses-item_title">Hints</div>

            <div className="ag-courses-item_date-box">
              <span className="ag-courses-item_date">
                Get hints when you're stuck on tough riddles.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
