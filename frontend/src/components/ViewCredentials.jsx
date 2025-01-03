import React, { useState, useEffect } from "react";
import api from "../services/api";

const ViewCredentials = ({ divisionId }) => {
    const [credentials, setCredentials] = useState([]);

    useEffect(() => {
        const fetchCredentials = async () => {
            try {
                const { data } = await api.get(`/credentials/${divisionId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setCredentials(data);
            } catch (error) {
                console.error("Error fetching credentials:", error);
            }
        };

        fetchCredentials();
    }, [divisionId]);

    return (
        <div>
            <h3>Credentials</h3>
            <ul>
                {credentials.map((credential) => (
                    <li key={credential.id}>
                        <strong>Site:</strong> {credential.site} <br />
                        <strong>Username:</strong> {credential.username} <br />
                        <strong>Password:</strong> {credential.password}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewCredentials;