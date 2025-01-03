import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const updateAuthState = () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        setIsLoggedIn(!!token);

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
        // Initialize state on mount
        updateAuthState();

        // Listen for changes in localStorage
        const handleStorageChange = () => {
            updateAuthState();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Update state to reflect logout
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/login");
    };

    const handleLogin = () => {
        // Navigate to login page
        navigate("/login"); // Ensure this path exists in your Routes
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Capstone App
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                {isAdmin && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin">
                                            Admin Panel
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                        <li className="nav-item">
                            {isLoggedIn ? (
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleLogin}  // Ensure this triggers the login navigation
                                >
                                    Login
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
