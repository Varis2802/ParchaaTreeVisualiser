import React, { useState, useEffect, useRef } from 'react';
import './AnimatedCanvas.css'; // Create a CSS file for styling the canvas
import image from "../../Assets/daddu.png";
import ProgressBar from '../ProgressBar';
import errorimage from '../../Assets/sad-emoji.jpg'


const AnimatedCanvas = ({ percentage, startAnimation, errorOccurred }) => {
  const canvasRef = useRef(null);

  // Function to draw the animated image on the canvas
  const draw = (ctx, canvas, img, y) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, y, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load the image
    const img = new Image();
    img.src = image; // Replace with the path to your image

    let y = 0; // Initial y position of the image
    let direction = 1; // 1 for moving down, -1 for moving up
    let animationFrameId;
    let movementCounter = 0;

    // Animation loop
    const animate = () => {
      if (startAnimation) {
        animationFrameId = requestAnimationFrame(animate);

        if (y <= -20 || y >= 0) {
          movementCounter += 1;
          if (movementCounter % 2 === 0) {
            direction *= -1; // Reverse direction every 2 movements
          }
        }
        y += direction * 0.5; // Adjust the speed of the image movement (you can change this value)
        draw(ctx, canvas, img, y);
      }
    };

    // Start the animation loop when startAnimation becomes true
    animate();

    // Clean up the canvas on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [startAnimation]);

  return (
    <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={250} // Set the canvas width (adjust as needed)
          height={250} // Set the canvas height (adjust as needed)
        />
      <ProgressBar percentage={percentage} />
    </div>
  );
};

export default AnimatedCanvas;
