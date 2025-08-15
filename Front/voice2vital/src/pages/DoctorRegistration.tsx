import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorRegistration: React.FC = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    practiceNumber: "",
    specialty: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save locally (mock). Replace with API call later.
    localStorage.setItem("doctorProfile", JSON.stringify(form));
    nav("/");
  };

  return (
    <div className="page" style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Doctor Registration</h1>
      <form onSubmit={onSubmit} className="card" style={{ display: "grid", gap: 12 }}>
        <input placeholder="Full name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
        <input placeholder="Practice number" value={form.practiceNumber} onChange={(e) => update("practiceNumber", e.target.value)} />
        <input placeholder="Specialty" value={form.specialty} onChange={(e) => update("specialty", e.target.value)} />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default DoctorRegistration;
