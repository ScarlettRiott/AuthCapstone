import React, { useEffect, useState } from "react";
import api from "../services/api";

const ViewCredentials = ({ divisionId }) => {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCredentials = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/credentials/${divisionId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setCredentials(data);
            } catch (error) {
                console.error("Error fetching credentials:", error);
                alert("Failed to load credentials.");
            } finally {
                setLoading(false);
            }
        };

        if (divisionId) {
            fetchCredentials();
        }
    }, [divisionId]);

    return (
        <div>
            <h3>Credentials</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {credentials.map((cred, index) => (
                        <li key={index}>
                            <strong>Site:</strong> {cred.site} <br />
                            <strong>Username:</strong> {cred.username}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewCredentials;
