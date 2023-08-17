import React from 'react';

export const Step = ({
  stepNumber,
  imageSrc,
  description,
  onImageChange,
  onDescriptionChange,
}) => (
  <div className="step">
    <h2>Step {stepNumber}</h2>
    <input
      type="text"
      placeholder="Image URL"
      value={imageSrc}
      onChange={(e) => onImageChange(stepNumber, e.target.value)}
    />
    <textarea
      rows="4"
      placeholder="Step Description"
      value={description}
      onChange={(e) => onDescriptionChange(stepNumber, e.target.value)}
    />
  </div>
);
