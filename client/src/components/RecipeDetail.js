import React from 'react';

const RecipeDetail = ({ recipe, onAddToFavorites, onDelete, onClose }) => {
  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="recipe-detail-modal">
        <button className="close-btn" onClick={onClose}>✖</button>
        <img src={recipe.image} alt={recipe.name} />
        <h2>{recipe.name}</h2>
        <p>{recipe.description}</p>
        <h3>Steps:</h3>
        <ul>
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
        <button onClick={() => onAddToFavorites(recipe)}>
          {recipe.favorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
        </button>
        <button onClick={() => onDelete(recipe._id)} className="delete-button">
          ❌ Delete Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
