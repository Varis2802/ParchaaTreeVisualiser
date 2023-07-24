import React from 'react';
import "./popup.css" 

function PopupComponent({ isOpen, handleToggle, title, inputs, onSubmit }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    onSubmit(e); // Handle form submission manually
  };

  return (
    <div className="popup">
      <div className="form-wrapper">
        <form className="form" onSubmit={handleSubmit}> {/* Attach the handleSubmit function to the form onSubmit event */}
          <h3>{title}</h3>
          {inputs.map((input, index) => (
            <div key={index} className="input-wrapper">
              <label htmlFor={input.id} className="label"> {/* Use "htmlFor" instead of "for" to associate the label with the input */}
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
