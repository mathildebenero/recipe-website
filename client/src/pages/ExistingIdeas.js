import '../style/ExistingIdeas.css';
import React, { useEffect, useState, useRef } from 'react';

const ExistingIdeas = () => {
  const [recipes, setRecipes] = useState([]); // Store all fetched recipes
  const [loading, setLoading] = useState(false); // Show loading indicator
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [addedRecipes, setAddedRecipes] = useState(new Set()); // Track added recipes
  const [page, setPage] = useState(1); // Track current "page" of recipes

  const containerRef = useRef(null); // Reference to detect scrolling

  // ✅ Function to fetch 10 recipes at a time
  const fetchRecipeIdeas = async () => {
    if (loading) return; // Prevent multiple requests at the same time

    setLoading(true);
    try {
      let newRecipes = [];
      for (let i = 0; i < 10; i++) { // Fetch 10 recipes
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        if (!response.ok) throw new Error('Failed to fetch recipe ideas');
        const data = await response.json();
        
        if (data.meals) {
          const transformedRecipes = data.meals.map(meal => ({
            category: meal.strCategory === 'Dessert' ? 'sweety' : 'salty',
            name: meal.strMeal,
            image: meal.strMealThumb,
            description: meal.strInstructions,
            steps: meal.strInstructions ? meal.strInstructions.split('. ').filter(Boolean) : [],
            favorite: false,
          }));
          newRecipes = [...newRecipes, ...transformedRecipes];
        }
      }
      setRecipes(prevRecipes => [...prevRecipes, ...newRecipes]); // Append new recipes
      setPage(prevPage => prevPage + 1); // Increment page number
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  // ✅ Infinite Scroll: Detect when user reaches bottom
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20) { // User reached bottom
          fetchRecipeIdeas();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [recipes]);

  // ✅ Load recipes on first visit but keep them if navigating back
  useEffect(() => {
    if (recipes.length === 0) { // Prevent reloading already loaded recipes
      fetchRecipeIdeas();
    }
  }, []);

  const handleAddExistingRecipe = async (recipe) => {
    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${recipe.name} added successfully!`);
        setAddedRecipes((prevSet) => new Set(prevSet).add(recipe.name));
      } else {
        setMessage(`⚠️ ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      setMessage('⚠️ Error adding recipe.');
    }
  };

  return (
    <div className="existing-ideas" ref={containerRef} style={{ overflowY: 'auto', maxHeight: '90vh' }}>
      <h1>Recipe Ideas</h1>
      {message && <p className="message">{message}</p>}
      <div className="recipe-grid">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-item">
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description.split('. ')[0]}...</p>
            <button
              onClick={() => handleAddExistingRecipe(recipe)}
              className="nav-button"
              disabled={addedRecipes.has(recipe.name)}
            >
              {addedRecipes.has(recipe.name) ? '✔ Added' : 'Add to My Recipes'}
            </button>
          </div>
        ))}
      </div>
      {loading && <p>Loading more recipes...</p>}
    </div>
  );
};

export default ExistingIdeas;
