import React from 'react';
import "./popup.css" 

function PopupComponent({ isOpen, handleToggle, title, inputs, onSubmit }) {
  if (!isOpen) return null;
  return (
    <div className="popup">
      <div className="form-wrapper">
        <form className="form">
          <h3>{title}</h3>
          {inputs.map((input, index) => (
            <div key={index} className="input-wrapper">
              <label for={input.id} className="label">
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
          <button type="submit" onClick={(e) => onSubmit(e)}>
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
