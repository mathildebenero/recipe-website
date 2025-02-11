import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const Header = ({ onFilter, onAddRecipeClick }) => {
    const navigate = useNavigate(); // ✅ Create a navigation function

    return (
        <nav className="navbar">
            <div className="logo">Recipe Hub</div>
            <button className="nav-button" onClick={() => onFilter('all')} aria-label="View all recipes">
                All Recipes
            </button>
            <button className="nav-button" onClick={() => onFilter('salty')} aria-label="View salty recipes">
                Salty
            </button>
            <button className="nav-button" onClick={() => onFilter('sweet')} aria-label="View sweet recipes">
                Sweet
            </button>
            <button className="nav-button" onClick={() => onFilter('favorites')} aria-label="View favorite recipes">
                Favorites
            </button>
            <button className="nav-button" onClick={onAddRecipeClick} aria-label="Add a new recipe">
                Add Recipe
            </button>
            {/* ✅ Navigate to '/ideas' when button is clicked */}
            <button className="nav-button" onClick={() => navigate('/ideas')} aria-label="Get Recipe ideas">
                Get Recipe Ideas
            </button>
        </nav>
    );
};

export default Header;
