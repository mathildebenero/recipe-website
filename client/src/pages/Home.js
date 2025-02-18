import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa'; // Import hamburger icon
import Header from '../components/Header';
import RecipeList from '../components/RecipeList';
import RecipeDetail from '../components/RecipeDetail';
import AddRecipeForm from '../components/AddRecipeForm';
import '../style/Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // ✅ Move fetchRecipes OUTSIDE of useEffect
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

  // ✅ useEffect only runs fetchRecipes when component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);


  const handleFilter = (filter) => {
    if (filter === 'all') {
      setFilteredRecipes(recipes);
    } else if (filter === 'favorites') {
      setFilteredRecipes(recipes.filter((recipe) => recipe.favorite));
    } else {
      setFilteredRecipes(recipes.filter((recipe) => recipe.category === filter));
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowDetail(true);
  };

  const handleAddToFavorites = async (recipe) => {
    const newFavoriteStatus = !recipe.favorite;
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipe._id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: newFavoriteStatus }),
      });

      if (response.ok) {
        const updatedRecipe = await response.json();

        setRecipes((prevRecipes) =>
          prevRecipes.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
        );
        setFilteredRecipes((prevFilteredRecipes) =>
          prevFilteredRecipes.map((r) => (r._id === updatedRecipe._id ? updatedRecipe : r))
        );

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
    setShowDetail(false);
    setSelectedRecipe(null);
  };

  const handleAddRecipeClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
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

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id !== recipeId));
        setFilteredRecipes((prevFilteredRecipes) =>
          prevFilteredRecipes.filter((recipe) => recipe._id !== recipeId)
        );
        setShowDetail(false);
        alert('Recipe deleted successfully!');
      } else {
        alert('Failed to delete recipe.');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div>
      <Header onFilter={handleFilter} onAddRecipeClick={handleAddRecipeClick} />
      <RecipeList recipes={filteredRecipes} onRecipeClick={handleRecipeClick} />

      {showDetail && (
        <div className="modal">
          <div className="overlay" onClick={handleCloseDetail}></div>
          <div className="detail-content">
            <RecipeDetail
              recipe={selectedRecipe}
              onAddToFavorites={handleAddToFavorites}
              onDelete={handleDeleteRecipe}
              onClose={handleCloseDetail}
            />
          </div>
        </div>
      )}

      {showAddForm && <AddRecipeForm onClose={handleCloseAddForm} onSubmit={handleAddRecipe} />}
    </div>
  );
};

export default Home;
