import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ExistingIdeas from '../pages/ExistingIdeas';
import Home from './Home.js';

const App = () => {
  
  return (
    //  <Home/>
    // <ExistingIdeas />
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/ideas" element={<ExistingIdeas />}/>
        </Routes>
    </Router>
  );
};

export default App;


