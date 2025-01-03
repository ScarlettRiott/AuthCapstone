import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("");
    const [divisionId, setDivisionId] = useState("");
    const [users, setUsers] = useState([]); // List of users for the dropdown
    const [userRole, setUserRole] = useState(null); // Current user's role
    const navigate = useNavigate();

    // Check the logged-in user's role
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Access denied. Please log in.");
            navigate("/login");
        } else {
            setUserRole(user.role);
            if (user.role === "normal") {
                alert("Access denied. You do not have permission to view this page.");
                navigate("/dashboard");
            }
        }
    }, [navigate]);

    // Fetch users related to the admin's or management's OUs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("Fetching users from /admin/users-in-ou...");
                const { data } = await api.get("/admin/users-in-ou", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                console.log("Users fetched successfully:", data);
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error.response?.data || error.message);
                alert("Failed to load users. Please try again.");
            }
        };
    
        if (userRole === "admin" || userRole === "management") {
            fetchUsers();
        }
    }, [userRole]);

    const changeRole = async () => {
        if (userRole !== "admin") {
            alert("Access denied. Only admins can change user roles.");
            return;
        }

        try {
            await api.put(
                "/admin/change-role",
                { userId, role },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            alert("User role updated successfully.");
        } catch (error) {
            alert("Failed to update user role.");
        }
    };

    const assignDivision = async () => {
        if (userRole !== "admin" && userRole !== "management") {
            alert("Access denied. Only admins and management can assign divisions.");
            return;
        }

        try {
            await api.post(
                "/admin/assign-division",
                { userId, divisionId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            alert("User assigned to division successfully.");
        } catch (error) {
            alert("Failed to assign division.");
        }
    };

    const unassignDivision = async () => {
        if (userRole !== "admin" && userRole !== "management") {
            alert("Access denied. Only admins and management can unassign divisions.");
            return;
        }

        try {
            await api.post(
                "/admin/unassign-division",
                { userId, divisionId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            alert("User unassigned from division successfully.");
        } catch (error) {
            alert("Failed to unassign division.");
        }
    };

    

    return (
        <div className="container py-5">
            <h1>Admin Panel</h1>
            <p>Welcome, {userRole?.toUpperCase()}!</p>

            {/* Change Role Section (Admin Only) */}
            {userRole === "admin" && (
                <div className="mb-5">
                    <h3>Change User Role</h3>
                    <div className="mb-3">
                        <label>Select User</label>
                        <select
                            className="form-control"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.username} ({user.role})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>New Role</label>
                        <select
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="normal">Normal</option>
                            <option value="management">Management</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={changeRole}>
                        Change Role
                    </button>
                </div>
            )}

            {/* Assign/Unassign Division Section (Admin and Management) */}
            {(userRole === "admin" || userRole === "management") && (
                <div>
                    <h3>Manage Divisions</h3>
                    <div className="mb-3">
                        <label>Select User</label>
                        <select
                            className="form-control"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.username} ({user.role})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Division ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={divisionId}
                            onChange={(e) => setDivisionId(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success me-2" onClick={assignDivision}>
                        Assign Division
                    </button>
                    <button className="btn btn-danger" onClick={unassignDivision}>
                        Unassign Division
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
