import '../style/ExistingIdeas.css';
import React, { useEffect, useState, useRef } from 'react';

const ExistingIdeas = () => {
  const [recipes, setRecipes] = useState(() => {
    // Load saved recipes from localStorage on page load
    const savedRecipes = localStorage.getItem('savedRecipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  const [addedRecipes, setAddedRecipes] = useState(() => {
    // Load added recipes from localStorage to persist button state
    const savedAddedRecipes = localStorage.getItem('addedRecipes');
    return savedAddedRecipes ? new Set(JSON.parse(savedAddedRecipes)) : new Set();
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [page, setPage] = useState(1);

  const containerRef = useRef(null);

  // On mount, fetch user's current recipes from MongoDB and
  // remove from local addedRecipes any that no longer exist in the DB.
  useEffect(() => {
    const syncAddedRecipesWithDB = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes`);
        if (!response.ok) {
          throw new Error('Failed to fetch user recipes from DB');
        }
        const userRecipes = await response.json();
        // userRecipes is the array of your saved recipes from MongoDB
        // We'll track them by name for consistency with your code:
        const userRecipeNames = new Set(userRecipes.map((r) => r.name));

        setAddedRecipes((prevSet) => {
          // Keep only those that still exist in the DB by name
          const updatedSet = new Set(
            [...prevSet].filter((recipeName) => userRecipeNames.has(recipeName))
          );
          localStorage.setItem('addedRecipes', JSON.stringify([...updatedSet]));
          return updatedSet;
        });
      } catch (err) {
        console.error('Error syncing addedRecipes with DB:', err);
      }
    };

    syncAddedRecipesWithDB();
  }, []);

  // Function to fetch 10 recipes at a time
  const fetchRecipeIdeas = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let newRecipes = [];
      for (let i = 0; i < 10; i++) {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        if (!response.ok) throw new Error('Failed to fetch recipe ideas');
        const data = await response.json();

        if (data.meals) {
          const transformedRecipes = data.meals.map((meal) => {
            // Extract ingredients dynamically
            const ingredients = Array.from({ length: 20 }, (_, i) => {
              const ingredient = meal[`strIngredient${i + 1}`]?.trim();
              const measure = meal[`strMeasure${i + 1}`]?.trim();
              return ingredient && ingredient !== ''
                ? measure
                  ? `${measure} ${ingredient}`
                  : ingredient
                : null;
            }).filter(Boolean);

            return {
              id: meal.idMeal,
              category: meal.strCategory === 'Dessert' ? 'sweety' : 'salty',
              name: meal.strMeal,
              image: meal.strMealThumb,
              ingredients,
              steps: meal.strInstructions
                ? meal.strInstructions.split('. ').filter(Boolean)
                : [],
              favorite: false,
            };
          });
          newRecipes = [...newRecipes, ...transformedRecipes];
        }
      }

      setRecipes((prevRecipes) => {
        const updatedRecipes = [...prevRecipes, ...newRecipes];
        // Save them in localStorage so we don’t re-fetch unnecessarily
        localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
        return updatedRecipes;
      });

      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error('Error fetching ideas:', err);
      setError(err.message);
    }

    setLoading(false);
  };

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
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

  // Load recipes on first visit, but use stored recipes if available
  useEffect(() => {
    if (recipes.length === 0) {
      fetchRecipeIdeas();
    }
    // eslint-disable-next-line
  }, []);

  const handleAddExistingRecipe = async (recipe) => {
    console.log('Posting recipe:', recipe);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${recipe.name} added successfully!`);

        // Mark the recipe as added in localStorage
        setAddedRecipes((prevSet) => {
          const updatedSet = new Set(prevSet);
          updatedSet.add(recipe.name);
          localStorage.setItem('addedRecipes', JSON.stringify([...updatedSet]));
          return updatedSet;
        });
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
          // Use recipe.name as a key to avoid React's key warning
          <div key={`${recipe.idMeal}-${index}`} className="recipe-item">
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
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
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default ExistingIdeas;
