import React, { useRef } from 'react';
import "./popup.css" 

function PopupComponent({ isOpen, handleToggle, title, inputs, onSubmit }) {
  const popupRef = useRef(null);
  let offsetX, offsetY, isDragging = false;

  const handleMouseDown = (e) => {
    if (e.target.tagName === "INPUT") return; // Disable dragging when clicking on an input field
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - popupRef.current.getBoundingClientRect().left;
    offsetY = e.clientY - popupRef.current.getBoundingClientRect().top;
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    popupRef.current.style.left = `${x}px`;
    popupRef.current.style.top = `${y}px`;
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="popup" ref={popupRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="form-wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <h3>{title}</h3>
          {inputs.map((input, index) => (
            <div key={index} className="input-wrapper">
              <label htmlFor={input.id} className="label">
                {input.label}:
              </label>
              <input
                type="text"
                name={input.name}
                id={input.id}
                placeholder={input.placeholder}
                className="input"
                required
              />
            </div>
          ))}
          <button type="submit">
            {title}
          </button>
        </form>
        <button
          className="btn-close"
          onClick={() => handleToggle(false)}
        >
          X
        </button>
      </div>
    </div>
  );
}

export default PopupComponent;
