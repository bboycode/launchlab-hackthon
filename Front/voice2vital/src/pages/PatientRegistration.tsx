import React, { useState } from "react";

type Patient = {
  firstName: string;
  lastName: string;
  dob: string;
  idNumber: string;
  email: string;
  phone: string;
};

const PatientRegistration: React.FC = () => {
  const [p, setP] = useState<Patient>({
    firstName: "",
    lastName: "",
    dob: "",
    idNumber: "",
    email: "",
    phone: "",
  });

  const update = (k: keyof Patient, v: string) => setP((s) => ({ ...s, [k]: v }));
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list: Patient[] = JSON.parse(localStorage.getItem("patients") || "[]");
    list.push(p);
    localStorage.setItem("patients", JSON.stringify(list));
    setSaved(true);
  };

  return (
    <div className="page" style={{ maxWidth: 620, margin: "40px auto" }}>
      <h1>Register New Patient</h1>
      <form onSubmit={onSubmit} className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <input placeholder="First name" value={p.firstName} onChange={(e) => update("firstName", e.target.value)} required />
          <input placeholder="Last name" value={p.lastName} onChange={(e) => update("lastName", e.target.value)} required />
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <input type="date" placeholder="Date of birth" value={p.dob} onChange={(e) => update("dob", e.target.value)} />
          <input placeholder="ID/Passport number" value={p.idNumber} onChange={(e) => update("idNumber", e.target.value)} />
        </div>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
          <input type="email" placeholder="Email" value={p.email} onChange={(e) => update("email", e.target.value)} />
          <input placeholder="Phone" value={p.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <button type="submit">Save Patient</button>
        {saved && <div style={{ color: "green" }}>Saved ✓</div>}
      </form>
    </div>
  );
};

export default PatientRegistration;
