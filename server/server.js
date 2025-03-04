const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./User");
const Recipe = require('./Recipe');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

  // Secure Admin Creation Endpoint
app.post("/create-admin", async (req, res) => {
  const { email, password, secretKey } = req.body;

  console.log("🔹 Received secretKey:", secretKey);
  console.log("🔹 Stored ADMIN_SECRET:", process.env.ADMIN_SECRET); // Debugging line

  // Check if the provided secret key matches the one in .env
  if (secretKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: "Unauthorized action" });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already exists" });

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create a new admin user
      const newAdmin = new User({ email, password: hashedPassword, role: "admin" });
      await newAdmin.save();

      res.json({ message: "Admin user created successfully", user: { email, role: "admin" } });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});


  // Register function
  app.post("/register", async (req, res) => {
    const { email, password, role } = req.body; // Role can be "admin" or "user"

    try {
        // Check if the email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();

        res.json({ message: "User registered successfully", user: { email, role } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Login function
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid email or password" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ error: "Invalid email or password" });

      // Generate JWT Token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Login successful", token });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});

//Middleware to Protect Routes (authenticateToken). This middleware verifies JWT tokens before allowing access.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
  });
};

// POST route to add a new recipe
app.post('/api/recipes', authenticateToken, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only admins can add recipes." });
  }

  try {
    const { category, name, image, ingredients, steps } = req.body;

    const newRecipe = new Recipe({ category, name, image, ingredients, steps });
    await newRecipe.save();
    
    console.log('🛠️ DEBUG: Recipe saved successfully:', newRecipe);
    res.status(201).json({ message: 'Recipe added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add recipe' });
  }
});


// DELETE route to remove a recipe by ID
app.delete('/api/recipes/:id', authenticateToken, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only admins can add recipes." });
  }

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
app.patch('/api/recipes/:id/favorite', authenticateToken, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Only admins can update recipes." });
  }
  
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
