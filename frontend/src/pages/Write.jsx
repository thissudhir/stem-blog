import React, { useContext, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Step } from '../components/Step';
import axios from 'axios'; // Use single quotes consistently
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

export const Write = () => {
  const navigate = useNavigate(); // UseNavigate hook
  const { currentUser } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [steps, setSteps] = useState([]);
  const [imageSrc, setImageSrc] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Add imageUrl state
  const [title, setTitle] = useState(''); // Initialize title state
  const [description, setDescription] = useState(''); // Add description state
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('physics'); // Initialize subject state with default value
  const [difficultyLevel, setDifficultyLevel] = useState(1); // Initialize with a default value

  const [materials, setMaterials] = useState([{ name: '', quantity: '' }]);
  const [safetyPrecautions, setSafetyPrecautions] = useState(''); // Add safetyPrecautions state

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };
  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       setImageSrc(event.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };


  const handleMaterialChange = (index, field, fieldValue) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index][field] = fieldValue;
    setMaterials(updatedMaterials);
  };

  const addMaterial = () => {
    setMaterials([...materials, { name: '', quantity: '' }]);
  };

  const removeMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  const addStep = () => {
    const newStep = {
      stepNumber: steps.length + 1,
      imageSrc: '',
      description: '',
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepNumber) => {
    const updatedSteps = steps.filter((step) => step.stepNumber !== stepNumber);
    setSteps(updatedSteps);
  };

  const updateStepImage = (stepNumber, imageSrc) => {
    const updatedSteps = steps.map((step) =>
      step.stepNumber === stepNumber ? { ...step, imageSrc } : step
    );
    setSteps(updatedSteps);
  };
  
  const updateStepDescription = (stepNumber, description) => {
    const updatedSteps = steps.map((step) =>
      step.stepNumber === stepNumber ? { ...step, description } : step
    );
    setSteps(updatedSteps);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please log in to create a post.'); // Set the error message
      return;
    }
    // Create a new experiment object with all the data
    try {
    const newExperiment = {
      name: title,
      description: description,
      subject: subject,
      main_image: imageUrl,
      materials: materials,
      safetyPrecautions: safetyPrecautions,
      steps: steps,
      difficulty: difficultyLevel,
    };

      // Post the new experiment data to create a new experiment
      await axios.post('http://localhost:8800/api/posts', newExperiment);
 // Use your API endpoint here

 // Navigate to the home page
 navigate('/');
} catch (error) {
  console.error('Error creating new experiment:', error);
}
};
// console.log("safetyPrecautions",safetyPrecautions);
// console.log("difficultyLevel",difficultyLevel);


  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Experiment Name"
          value={title} // Bind title value
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <textarea
            rows="4"
            placeholder="One line description"
            value={description} // Bind description value
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>
        <div className="materials">
          <h1>Materials List</h1>
          {materials.map((material, index) => (
            <div className="material" key={index}>
              <input
                type="text"
                placeholder="Material Name"
                value={material.name}
                onChange={(e) =>
                  handleMaterialChange(index, 'name', e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Quantity"
                value={material.quantity}
                onChange={(e) =>
                  handleMaterialChange(index, 'quantity', e.target.value)
                }
              />
              {materials.length > 1 && (
                <button type="button" onClick={() => removeMaterial(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addMaterial}>
            Add Material
          </button>
        </div>
        <div className="safety">
          <h1>Safety Precautions</h1>
          <textarea
            rows="4"
            placeholder="Enter safety precautions here..."
            value={safetyPrecautions} // Bind safetyPrecautions value
            onChange={(e) => setSafetyPrecautions(e.target.value)}
          />
        </div>
        <div className="steps">
          <h1>Step-by-step Instructions</h1>
          {steps.map((step) => (
            <div key={step.stepNumber} className="step">
              <Step
                stepNumber={step.stepNumber}
                imageSrc={step.imageSrc}
                description={step.description}
                onImageChange={updateStepImage} // Pass the function as prop
                onDescriptionChange={updateStepDescription} // Pass the function as prop
              />
              <button onClick={() => removeStep(step.stepNumber)}>
                Remove Step
              </button>
            </div>
          ))}

          <button onClick={addStep}>Add Next Step</button>
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          {error && <p className="error">{error}</p>}
          <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={handleImageUrlChange}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Uploaded"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          <div className="buttons">
            {/* <button>Save as a Draft</button> */}
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
        <div className="difficulty">
          <h1>Difficulty Level</h1>
          <label htmlFor="difficulty"></label>
          <select
            id="difficulty"
            name="difficulty"
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

          <div className="subject">
            <h1>Subject</h1>
            <label htmlFor="subject"></label>
            <select
              id="subject"
              name="subject"
              value={subject} // Bind subject value
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
              <option value="generalScience">General Science</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
