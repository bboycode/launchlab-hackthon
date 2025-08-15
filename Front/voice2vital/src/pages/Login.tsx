import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    // Dummy auth: accept anything non-empty
    if (!email || !password) {
      setErr("Enter email and password.");
      return;
    }
    localStorage.setItem("authUser", JSON.stringify({ email }));
    nav("/dashboard");
  };

  return (
    <div className="page" style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Doctor Login</h1>
      <form onSubmit={onSubmit} className="card" style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {err && <div style={{ color: "crimson" }}>{err}</div>}
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: 12 }}>
        New doctor? <a href="/doctor-register">Create an account</a>
      </p>
    </div>
  );
};

export default Login;
