import React from 'react';

const RecipeItem = ({ recipe, onClick }) => { // defines a functional component called RecipeItem.
    // this component accepts 2 props: recipe obkect that contains all the data about the recipe
    // and onClick, a function to be executed when user clicks on recipe item (passed down from the parent RecipeList)
  return (
    // This div acts as a clickable container for the recipe.
    // The onClick={onClick} attribute adds an event listener to the div.
    // When the user clicks anywhere inside the div, it triggers the onClick function passed down from the parent component.
    // This function is responsible for handling the recipe click event (e.g., showing recipe details).
    <div onClick={onClick}> 
      <img src={recipe.image} alt={recipe.name} />
      <h3>{recipe.name}</h3>
    </div>
  );
};

// {recipe.image} and {recipe.name} refer to dynamic data from the recipe object, rendering the specific recipe’s image and name on the page.

export default RecipeItem;
