import React, { useEffect, useState } from "react";
import api from "../services/api";
import AddCredential from "./AddCredential";
import AddOUCredential from "./AddOUCredential";
import ViewCredentials from "./ViewCredentials";

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

    const [selectedDivision, setSelectedDivision] = useState(user?.divisions[0]?._id || "");
    const [selectedOU, setSelectedOU] = useState(user?.ous[0]?._id || "");

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

    const isAdmin = user?.role === "admin";

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
            <div className="mb-3">
                <label htmlFor="ou-select" className="form-label">Select OU</label>
                <select
                    id="ou-select"
                    className="form-select"
                    value={selectedOU}
                    onChange={(e) => setSelectedOU(e.target.value)}
                >
                    {user?.ous.map((ou) => (
                        <option key={ou._id} value={ou._id}>
                            {ou.name}
                        </option>
                    ))}
                </select>
            </div>
            {isAdmin && (
                <div className="mb-4">
                    <h2>Add Credential to Division</h2>
                    <AddCredential divisionId={selectedDivision} />
                </div>
            )}
            <div className="mb-4">
                <h2>Add Credential to OU</h2>
                <AddOUCredential ouId={selectedOU} />
            </div>
            <div className="mb-4">
                <h2>View Credentials</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <ViewCredentials divisionId={selectedDivision} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;