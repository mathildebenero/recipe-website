import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';

const App = () => {
  const [recipes, setRecipes] = useState([]); // This will hold the fetched recipes
  const [filteredRecipes, setFilteredRecipes] = useState([]); // This will hold the filtered recipes
  const [selectedRecipe, setSelectedRecipe] = useState(null); // The currently selected recipe for details
  const [showDetail, setShowDetail] = useState(false); // Control visibility of recipe details

  // Fetch recipes from the server (replace with your actual fetch logic)
  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch('/api/recipes'); // Replace with your API endpoint
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data); // Initialize filteredRecipes with all recipes
    };
    fetchRecipes();
  }, []);

  const handleFilter = (filter) => {
    if (filter === 'all') {
      setFilteredRecipes(recipes); // Show all recipes
    } else {
      setFilteredRecipes(recipes.filter(recipe => recipe.type === filter)); // Filter based on type
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe
    setShowDetail(true); // Show the recipe details modal
  };

  const handleCloseDetail = () => {
    setShowDetail(false); // Hide the recipe details modal
    setSelectedRecipe(null); // Clear selected recipe
  };

  return (
    <div>
      <Header onFilter={handleFilter} />
      <RecipeList recipes={filteredRecipes} onRecipeClick={handleRecipeClick} />
      
      {/* Conditional rendering for the RecipeDetail modal */}
      {showDetail && (
        <div className="modal">
          <div className="overlay" onClick={handleCloseDetail}></div> {/* Dark overlay */}
          <div className="detail-content">
            <RecipeDetail recipe={selectedRecipe} onAddToFavorites={/* Your function */} />
            <button onClick={handleCloseDetail}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
