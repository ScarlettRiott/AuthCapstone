import React, { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
    const [credentials, setCredentials] = useState([]);
   
    const [loading, setLoading] = useState(false);
    const user = (() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser || storedUser === "undefined") {
                console.warn("No valid user data in localStorage.");
                return null;
            }
            return JSON.parse(storedUser);
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    })();

    const [selectedDivision, setSelectedDivision] = useState(`${user.divisions[0]._id}`);

    useEffect(() => {
       const fetchCredentials = async () => {
        if (!selectedDivision) return;

        setLoading(true);
        try {
            const { data } = await api.get(`/credentials/${selectedDivision}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCredentials(data);
       } catch (error) {
        console.error("Failed to load credentials:", error);
        alert("Failed to load credentials");
       } finally {
        setLoading(false);
       }
       };

       fetchCredentials();
    }, [selectedDivision]);
    return (
        <div className="container py-5">
            <h1 className="mb-4">Dashboard</h1>
            <div className="mb-3">
                <label htmlFor="division-select" className="form-label">Select Division</label>
                <select
                    id="division-select"
                    className="form-select"
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                >
                    {user?.divisions.map((division) => (
                        <option key={division._id} value={division._id}>
                            {division.name}
                        </option>
                    ))}
                </select>
            </div>
            <ul className="list-group">
                {credentials.map((cred, index) => (
                    <li key={index} className="list-group-item">
                        <strong>Site:</strong> {cred.site} <br />
                        <strong>Username:</strong> {cred.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
