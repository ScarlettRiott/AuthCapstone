import React, { useState } from "react";
import api from "../services/api";

const AddCredential = ({ divisionId }) => {
    const [site, setSite] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                `/credentials/${divisionId}`,
                { site, username, password },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setMessage("Credential added successfully.");
            setSite("");
            setUsername("");
            setPassword("");
        } catch (error) {
            console.error("Error adding credential:", error);
            setMessage("Failed to add credential. Please try again.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Site</label>
                    <input
                        type="text"
                        value={site}
                        onChange={(e) => setSite(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Credential</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddCredential;