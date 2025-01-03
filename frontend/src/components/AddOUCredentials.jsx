import React, { useState } from "react";
import api from "../services/api";

const AddOUCredential = ({ ouId }) => {
    const [site, setSite] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                `/ou/${ouId}/credentials`,
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
            <h3>Add Credential to OU</h3>
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

export default AddOUCredential;
