import React, { useState } from 'react';

const AddRecipeForm = ({ onClose, onSubmit }) => {
  const [category, setCategory] = useState('salty');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState(['']);

  const handleStepChange = (e, index) => {
    const newSteps = [...steps];
    newSteps[index] = e.target.value;
    setSteps(newSteps);
  };

  const addStepField = () => {
    setSteps([...steps, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecipe = { category, name, image, description, steps };

    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        alert('Recipe added successfully!');
        onClose();
      } else {
        alert('Failed to add recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the recipe.');
    }
  };

  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
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
