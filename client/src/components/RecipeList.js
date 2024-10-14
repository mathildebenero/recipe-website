import React from 'react';
import RecipeItem from './RecipeItem'; // a compomemt to display each recipe

const RecipeList = ({ recipes, onRecipeClick }) => { // the functional component named RecipeList accepts 2 props:
    // recipes: an array of recipes objects, onRecipeClick: function to be triggered when user clicks on a recipe
    return (
        <div>
            {recipes.map(recipe => ( // itirates over the recipes array with the .map() function, for each recipe in the array, a RecipeItem will be rendered
                <RecipeItem key={recipe.id} recipe={recipe} onClick={() => onRecipeClick(recipe)} />
            ))}
        </div>
    );
};

// For each recipe, we create a RecipeItem component and pass it three key props:
// key={recipe.id}: React requires a unique key for each list item when rendering lists. This helps React keep track of which items have changed, been added, or been removed during re-renders. We use the recipe's unique id as the key.
// recipe={recipe}: The entire recipe object is passed down as a prop to the RecipeItem component. This allows the RecipeItem to have access to the recipe details (like the name, image, etc.).
// onClick={() => onRecipeClick(recipe)}: This defines the click behavior for each RecipeItem. When a recipe is clicked, the onRecipeClick function (passed as a prop) is invoked, and the specific recipe object is passed to that function. This is how the parent component knows which recipe was clicked.

export default RecipeList;
