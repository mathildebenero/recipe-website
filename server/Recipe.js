// models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
