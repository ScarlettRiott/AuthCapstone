import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file for styling

const Navbar = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    const updateAuthState = () => {
        const user = localStorage.getItem("user");

        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setIsAdmin(parsedUser.role === "admin" || parsedUser.role === "management");
            } catch (error) {
                console.error("Failed to parse user data:", error);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    };

    useEffect(() => {
        updateAuthState();
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Update state to reflect logout
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/" className="navbar-link">Home</Link>
                </li>
                {isLoggedIn && (
                    <>
                        <li className="navbar-item">
                            <Link to="/profile" className="navbar-link">Profile</Link>
                        </li>
                        {isAdmin && (
                            <li className="navbar-item">
                                <Link to="/admin" className="navbar-link">Admin</Link>
                            </li>
                        )}
                        <li className="navbar-item">
                            <button onClick={handleLogout} className="navbar-button">Logout</button>
                        </li>
                    </>
                )}
                {!isLoggedIn && (
                    <li className="navbar-item">
                        <Link to="/login" className="navbar-link">Login</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;