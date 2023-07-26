import React, { useState, useEffect } from 'react';
import './ProgressBar.css'; // Create a CSS file for styling the progress bar

const ProgressBar = ({ percentage }) => {
  const [animationValue, setAnimationValue] = useState(0);

  // Update the animationValue whenever the percentage prop changes
  useEffect(() => {
    setAnimationValue(percentage);
  }, [percentage]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${animationValue}%` }}
        />
      </div>
      <div className="progress-bar-label">{`${animationValue}%`}</div>
    </div>
  );
};

export default ProgressBar;
