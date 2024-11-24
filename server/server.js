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


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
