import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import AddRecipeForm from './components/AddRecipeForm'; // Import AddRecipeForm
import './App.css';


const App = () => {
  const [recipes, setRecipes] = useState([]); // This will hold the fetched recipes
  const [filteredRecipes, setFilteredRecipes] = useState([]); // This will hold the filtered recipes
  const [selectedRecipe, setSelectedRecipe] = useState(null); // The currently selected recipe for details
  const [showDetail, setShowDetail] = useState(false); // Control visibility of recipe details
  const [showAddForm, setShowAddForm] = useState(false); // For add recipe form


  // Fetch recipes from the server (replace with your actual fetch logic)
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/recipes');
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleFilter = (filter) => {
    console.log(filter)
    console.log(filter === 'all')
    if (filter === 'all') {
      setFilteredRecipes(recipes); // Show all recipes
    } else {
      setFilteredRecipes(recipes.filter(recipe => recipe.category === filter)); // Filter based on type
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe
    setShowDetail(true); // Show the recipe details modal
  };

  const handleAddToFavorites = (recipe) => {
    console.log('Adding to favorites:', recipe);
    // Add logic to save to favorites if needed
  };

  const handleCloseDetail = () => {
    setShowDetail(false); // Hide the recipe details modal
    setSelectedRecipe(null); // Clear selected recipe
  };

  const handleAddRecipeClick = () => {
    setShowAddForm(true); // Show add recipe form
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false); // Hide add recipe form
  };

  const handleAddRecipe = async (newRecipe) => {
    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });
  
      if (response.ok) {
        const data = await response.json();
        setRecipes([...recipes, data]);
        setFilteredRecipes([...recipes, data]);
        setShowAddForm(false);
      } else {
        alert('Failed to add recipe.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  return (
    <div>
      <Header onFilter={handleFilter} onAddRecipeClick={handleAddRecipeClick}/>
      <RecipeList recipes={filteredRecipes} onRecipeClick={handleRecipeClick} />
      
      {/* Conditional rendering for the RecipeDetail modal */}
      {showDetail && (
        <div className="modal">
          <div className="overlay" onClick={handleCloseDetail}></div>
          <div className="detail-content">
            <RecipeDetail recipe={selectedRecipe} onAddToFavorites={handleAddToFavorites}/>
            <button onClick={handleCloseDetail}>Close</button>
          </div>
        </div>
      )}

      {showAddForm && (
        <AddRecipeForm onClose={handleCloseAddForm} onSubmit={handleAddRecipe} />
      )}
    </div>
  );
};

export default App;
