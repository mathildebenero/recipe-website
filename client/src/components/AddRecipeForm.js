import React, { useState } from 'react';

const AddRecipeForm = ({ onClose, onSubmit }) => {
  const [category, setCategory] = useState('salty'); // default to 'salty'
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']); // Start with one empty step

  const handleStepChange = (e, index) => { // handleStepChange: This function updates the step at a specific index when the user types in a step input field.
    const newSteps = [...steps]; // Creates a copy of the steps array to avoid mutating the original array directly.
    newSteps[index] = e.target.value; // Updates the value of the step at the given index with the user's input.
    setSteps(newSteps); // Updates the steps state with the modified array
  };

  const addStepField = () => { // Adds a new empty step to the steps array.
    setSteps([...steps, '']); // Updates the state with the new array containing an additional step input field.
  };

  const handleSubmit = (e) => { // This function is called when the form is submitted.
    e.preventDefault(); // Prevents the default form behavior, which would reload the page upon submission.
    const newRecipe = { category, name, image, description, steps }; // creates a new recipe object
    onSubmit(newRecipe); // Pass the new recipe back to the parent component (App.js)
  };

  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div> {/* Click overlay to close */}
      <div className="form-content">
        <h2>Add New Recipe</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="salty">Salty</option>
              <option value="sweet">Sweet</option>
            </select>
          </label>
          <label>
            Recipe Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Image URL:
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label>
            Steps:
            {steps.map((step, index) => (
              <input
                key={index}
                type="text"
                value={step}
                onChange={(e) => handleStepChange(e, index)}
                required
              />
            ))}
            <button type="button" onClick={addStepField}>Add Step</button>
          </label>
          <button type="submit">Add Recipe</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddRecipeForm;
