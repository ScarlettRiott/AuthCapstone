import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login button clicked"); // Debugging statement
        try {
            console.log("Sending login request with:", { username, password });
            const { data } = await api.post("/auth/login", { username, password });
            console.log("Login successful, received data:", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user)); // Store user data, including divisions
            alert("Login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            alert("Login failed. Check your credentials.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;