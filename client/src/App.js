import React, { useState, useEffect, useRef } from 'react';
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

  // Create refs to track modal elements
  const detailRef = useRef(null);
  const addFormRef = useRef(null);


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
    if (filter === 'all') {
        setFilteredRecipes(recipes);// Show all recipes
    } else if (filter === 'favorites') {
        setFilteredRecipes(recipes.filter((recipe) => recipe.favorite)); // show the favorites recipe
    } else {
        setFilteredRecipes(recipes.filter((recipe) => recipe.category === filter)); // Filter based on type
    }
};

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe
    setShowDetail(true); // Show the recipe details modal
  };

  const handleAddToFavorites = async (recipe) => {
    const newFavoriteStatus = !recipe.favorite; // Toggle the current favorite status
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipe._id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: newFavoriteStatus }),
      });
  
      if (response.ok) {
        const updatedRecipe = await response.json();
  
        // Update the recipes state
        setRecipes((prevRecipes) =>
          prevRecipes.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
        );
  
        // Update filteredRecipes to reflect the change
        setFilteredRecipes((prevFilteredRecipes) =>
          prevFilteredRecipes.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
        );
  
        // Update selectedRecipe if it matches the updated recipe
        if (selectedRecipe && selectedRecipe._id === updatedRecipe._id) {
          setSelectedRecipe(updatedRecipe);
        }
  
        console.log(
          `Recipe updated: ${updatedRecipe.favorite ? 'Added to favorites' : 'Removed from favorites'}`
        );
      } else {
        console.error('Failed to update recipe favorite status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
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
  
  // Handle global clicks to close modals
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (
        (detailRef.current && !detailRef.current.contains(e.target)) &&
        (addFormRef.current && !addFormRef.current.contains(e.target))
      ) {
        setShowDetail(false);
        setShowAddForm(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);

  
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
        <AddRecipeForm ref={addFormRef} onClose={handleCloseAddForm} onSubmit={handleAddRecipe} />
      )}
    </div>
  );
};

export default App;
