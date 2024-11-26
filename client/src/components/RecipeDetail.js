import React from 'react';

const RecipeDetail = ({ recipe, onAddToFavorites }) => { // defines a component named RecipeDetail
    // it accepts 2 props: recipe, an object containing data about a specific recipe
    // onAddToFavorites: a function that will be called when the "add to favorites" button is clicked
  return (
    // div has class for css style
    <div className="recipe-detail"> 
      <img src={recipe.image} alt={recipe.name} /> {/* Display the recipe image */}

      <h2>{recipe.name}</h2> {/* Display the recipe name */}
      <p>{recipe.description}</p> {/* Display the recipe description */}
      <h3>Steps:</h3>
      <ul>{/* opens an unordered list */}
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
        {/* Maps over the recipe steps: This code uses the map method to iterate over the steps array from the recipe object.
            For each step, it creates a <li> (list item) element.
            step: Represents each individual step in the recipe.
            index: The index of the current step in the array, used as a unique key for each <li>.
            The key is important for React's reconciliation process when rendering lists of elements. */}
      </ul>
      <button onClick={() => onAddToFavorites(recipe)}>
      {recipe.favorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
    </button>


      {/* Creates a button: This <button> element allows users to add the recipe to their favorites or remove it from favorites.
      The onClick event handler calls the onAddToFavorites function, passing the current recipe as an argument when the button is clicked. */}
    </div>
  );
};

export default RecipeDetail;
