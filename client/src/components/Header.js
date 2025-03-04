import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const Header = ({ onFilter, onAddRecipeClick }) => {
    const navigate = useNavigate(); // ✅ Create a navigation function
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove JWT Token
        navigate("/login"); // Redirect to login page
    };


    return (
        <nav className="navbar">
            <div className="logo">Track your Recipes!</div> {/* ✅ Bigger and Prominent */}

            <div className="nav-buttons"> {/* ✅ Group buttons together */}
                <button onClick={() => onFilter('all')} aria-label="View all recipes">
                    All Recipes
                </button>
                <button onClick={() => onFilter('salty')} aria-label="View salty recipes">
                    Salty
                </button>
                <button onClick={() => onFilter('sweet')} aria-label="View sweet recipes">
                    Sweet
                </button>
                <button onClick={() => onFilter('favorites')} aria-label="View favorite recipes">
                    Favorites
                </button>
                <button onClick={onAddRecipeClick} aria-label="Add a new recipe">
                    Add Recipe
                </button>
                <button onClick={() => navigate('/ideas')} aria-label="Get Recipe ideas">
                    Get Recipe Ideas
                </button>
                {/* Show Logout button only if user is logged in */}
                {token ? (
                    <button onClick={handleLogout} style={{ marginLeft: "20px", backgroundColor: "red", color: "white" }}>
                        Logout
                    </button>
                ) : (
                    <button onClick={() => navigate("/login")}>Login</button>
                )}
            </div>
        </nav>
    );
};

export default Header;