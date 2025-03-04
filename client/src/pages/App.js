import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExistingIdeas from './ExistingIdeas.js';
import Home from './Home.js';
import Login from "./Login.js"; 
import Register from "./Register.js";

const App = () => {
  
  return (
    //  <Home/>
    // <ExistingIdeas />
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/ideas" element={<ExistingIdeas />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
  );
};

export default App;


