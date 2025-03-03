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
    validate: {
      validator: function(v) {
        return /^https?:\/\//.test(v); // Ensures the image field is a URL
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  ingredients: {
    type: [String],
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  favorite: { 
    type: Boolean,
    default: false,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
