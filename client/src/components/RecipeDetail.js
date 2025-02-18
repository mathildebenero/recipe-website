import React from 'react';

const RecipeDetail = ({ recipe, onAddToFavorites, onDelete, onClose }) => {
  return (
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="recipe-detail-modal" onClick={(e) => e.stopPropagation()}> 
        <button className="close-btn" onClick={onClose}>✖</button>
        <div className="modal-content">
          {/* Left Section: Image */}
          <div className="modal-left">
            <img src={recipe.image} alt={recipe.name} className="recipe-detail-image" />
          </div>

          {/* Right Section: Title + Ingredients + Steps */}
          <div className="modal-right">
            <h2>{recipe.name}</h2>

            {/* ✅ Ingredients list moved under the title */}
            <h3>Ingredients:</h3>
            <ul className="recipe-ingredients">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>

            <h3>Steps:</h3>
            <ul className="recipe-steps">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>

            <div className="modal-buttons">
              <button onClick={() => onAddToFavorites(recipe)}>
                {recipe.favorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
              </button>
              <button onClick={() => onDelete(recipe._id)} className="delete-button">
                ❌ Delete Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
