import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const nav = useNavigate();
  const user = useMemo(() => {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const patients = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("patients") || "[]") as Array<{ firstName: string; lastName: string }>;
    } catch {
      return [];
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authUser");
    nav("/");
  };

  return (
    <div className="page" style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Welcome {user?.email ?? "Doctor"}.</p>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <div className="card">
          <h3>Quick actions</h3>
          <ul>
            <li><Link to="/patient-register">Register a new patient</Link></li>
            <li><Link to="/session">Record a session</Link></li>
          </ul>
        </div>

        <div className="card">
          <h3>Recent patients</h3>
          {patients.length === 0 ? (
            <p>No patients yet.</p>
          ) : (
            <ul>
              {patients.slice(-5).reverse().map((p, i) => (
                <li key={i}>{p.firstName} {p.lastName}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3>Account</h3>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
