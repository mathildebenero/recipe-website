const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Recipe = require('./Recipe');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recipeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// POST route to add a new recipe
app.post('/api/recipes', async (req, res) => {
  try {
    const { category, name, image, description, steps } = req.body;
    const newRecipe = new Recipe({ category, name, image, description, steps });

    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add recipe' });
  }
});

// DELETE route to remove a recipe by ID
app.delete('/api/recipes/:id', async (req, res) => {
  try {
      const { id } = req.params;
      
      // Ensure the ID is valid before querying
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid Recipe ID" });
      }

      const deletedRecipe = await Recipe.findByIdAndDelete(id);
      console.log('the recipe to delete', deletedRecipe.name);
      if (!deletedRecipe) {
          return res.status(404).json({ message: "Recipe not found" });
      }

      res.json({ message: "Recipe deleted successfully", deletedRecipe });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting recipe", error: error.message });
  }
});


// GET route to fetch all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    console.log('Fetching recipes...');
    const recipes = await Recipe.find();
    console.log('Recipes found:', recipes);
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
});

// Update a recipe's favorite status
app.patch('/api/recipes/:id/favorite', async (req, res) => {
  const { id } = req.params; // Recipe ID from the request URL
  const { favorite } = req.body; // Favorite status (true/false) from the request body
  try {
    // Update the favorite field of the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { favorite },
      { new: true } // Return the updated recipe
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating favorite status:', error);
    res.status(500).json({ message: 'Failed to update favorite status' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
