// the navigation bar component

import React from 'react'; // imports React from the react library, which is necessary in any React component file to enable JSX (the HTML-like syntax)

const Header = ({ onFilter }) => { // defines a functional component called Header, that receives as a prop the function named onFilter
    return (
        <nav>
            <button onClick={() => onFilter('all')}>All Recipes</button>
            <button onClick={() => onFilter('salty')}>Salty</button>
            <button onClick={() => onFilter('sweet')}>Sweet</button>
            <button onClick={() => onFilter('favorites')}>Favorites</button>
        </nav>
    );
};
// The onClick event handler is used to detect when a button is clicked.
// When clicked, it triggers an anonymous arrow function that calls onFilter('all').
// The onFilter function is passed as a prop from the parent component (App.js), and the string 'all' tells the function which filter to apply (in this case, displaying all recipes).

export default Header; // exports the Header component so it can be imported and used in other files, such as in App.js.

// The Header component is a stateless functional component that renders a navigation bar with buttons.
// It accepts a prop called onFilter, which is a function for filtering recipes.
// Each button triggers the onFilter function with a different argument ('all', 'salty', 'sweet', or 'favorites') to filter the list of recipes accordingly.