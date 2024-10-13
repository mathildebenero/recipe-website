const express = require('express'); // imports the Express library for handling HTTP requests
const mongoose = require('mongoose'); // imports the Mongoose library (an Object Data Modeling library for MongoDB and Node.js)
const cors = require('cors'); // imports the CORS (Cross-Origin Resource Sharing) middleware. CORS is used to allow or restrict requested resources on a web server based on the origin of the request. This is important when your frontend and backend are served from different origins.
require('dotenv').config(); //imports the dotenv package, which loads environment variables from a .env file into process.env. This is where is stored sensitive information, such as MongoDB connection string, without hardcoding it into source code.

const app = express(); // initializes an Express application instance
const PORT = process.env.PORT || 5000; // sets the port number of the server

// middleware
app.use(cors()); // enables CORS for all routes in your Express application. It allows your React frontend (which might be running on a different port, like 3000) to make API requests to your Node.js backend (running on port 5000) without being blocked by the browser.
app.use(express.json()); // enables acces JSON data sent in HTTP requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { // establishes a connection to MongoDB database using the URI stored in the .env file as MONGO_UR
    useNewUrlParser: true, // allows the MongoDB driver to use the new URL parser
    useUnifiedTopology: true, // enables the new topology engine
  }).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err)); // handles the promise returned by the mongoose.connect call. If the connection is successful, it logs a success message to the console. If there's an error, it logs the error message.

// Starting the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }); // starts the server and listens for incoming requests on the specified PORT. Once the server is running, it logs a message to the console indicating that it is operational and which port it is listening on.
  