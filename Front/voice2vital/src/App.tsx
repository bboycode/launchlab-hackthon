import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import DoctorRegistration from "./pages/DoctorRegistration";
import PatientRegistration from "./pages/PatientRegistration";
import Dashboard from "./pages/Dashboard";
import SessionRecorder from "./pages/SessionRecorder";
import ClinicalNotes from "./pages/ClinicalNotes";
import ChatBox from "./pages/chatbot";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* <nav style={{ display: "flex", gap: 12, padding: 12, borderBottom: "1px solid #eee" }}>
        <Link to="/">Login</Link>
        <Link to="/doctor-register">Doctor Registration</Link>
        <Link to="/patient-register">New Patient</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/session">Session Recorder</Link>
        <Link to="/clinical-notes/1">Clinical Notes</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/doctor-register" element={<DoctorRegistration />} />
        <Route path="/patient-register" element={<PatientRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/session" element={<SessionRecorder />} />
        <Route path="/clinical-notes/:patientId" element={<ClinicalNotes />} />
        <Route path="/chatbox" element={<ChatBox />} />
      </Routes>
    </BrowserRouter>
  );
}