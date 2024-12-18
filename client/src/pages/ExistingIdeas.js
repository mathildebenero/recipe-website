// pages/ExistingIdeas.js
import '../style/ExistingIdeas.css'
import React, { useEffect, useState } from 'react';

const ExistingIdeas = () => {
  const [recipes, setRecipes] = useState([]); // State to hold the fetched recipe ideas
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch pre-existing recipe ideas from an external API
    const fetchRecipeIdeas = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php'); // Replace with your API URL
        if (!response.ok) throw new Error('Failed to fetch recipe ideas');
        
        const data = await response.json();
        if (data.meals) {
          // Transform API response to match your MongoDB schema
          const transformedRecipes = data.meals.map(meal => ({
            category: meal.strCategory === 'Dessert' ? 'sweety' : 'salty',
            name: meal.strMeal,
            image: meal.strMealThumb,
            description: meal.strInstructions,
            steps: meal.strInstructions ? meal.strInstructions.split('. ').filter(Boolean) : [],
            favorite: false, // Default to false
          }));
          setRecipes(transformedRecipes);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ideas:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipeIdeas();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="existing-ideas">
      <h1>Recipe Ideas</h1>
      <div className="recipe-grid">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-item">
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description.split('. ')[0]}...</p> {/* Show the first sentence */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExistingIdeas;
