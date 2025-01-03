// src/pages/AdminPanel.jsx
import { useState } from "react";
import API from "../services/api";

const AdminPanel = () => {
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");

    const changeRole = () => {
        API.put("/admin/role", { userId, role }).then(() => alert("Role updated"));
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="management">Management</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={changeRole}>Change Role</button>
        </div>
    );
};

export default AdminPanel;
