import React, { useEffect, useRef, useState } from "react";

type DocItem = { name: string; url: string; type: string };

const SessionRecorder: React.FC = () => {
  // --- Audio recording ---
  const mediaRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [note, setNote] = useState("");

  const start = async () => {
    setAudioURL(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    mediaRef.current = rec;
    chunksRef.current = [];

    rec.ondataavailable = (ev) => chunksRef.current.push(ev.data);
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    rec.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
  };

  // --- Document viewer / uploader ---
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocItem | null>(null);

  const onSelectDocs: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files ?? []);
    const items = files.map((f) => ({ name: f.name, url: URL.createObjectURL(f), type: f.type }));
    setDocs((d) => [...d, ...items]);
    if (!activeDoc && items[0]) setActiveDoc(items[0]);
  };

  // clean up object URLs
  useEffect(() => {
    return () => {
      docs.forEach((d) => URL.revokeObjectURL(d.url));
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSession = () => {
    const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    sessions.push({
      date: new Date().toISOString(),
      note,
      audioURL, // in a real app, upload and store a real URL
      docs: docs.map((d) => ({ name: d.name, type: d.type })),
    });
    localStorage.setItem("sessions", JSON.stringify(sessions));
    alert("Session saved (locally).");
  };

  return (
    <div className="page" style={{ padding: 24 }}>
      <h1>Session Recorder</h1>

      {/* Recorder */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Audio</h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!recording ? (
            <button onClick={start}>Start Recording</button>
          ) : (
            <button onClick={stop}>Stop</button>
          )}
          <span>{recording ? "Recording..." : "Idle"}</span>
        </div>

        {audioURL && (
          <div style={{ marginTop: 12 }}>
            <audio controls src={audioURL} />
            <div style={{ marginTop: 8 }}>
              <a href={audioURL} download={`session-${Date.now()}.webm`}>Download audio</a>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3>Session Notes</h3>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Type session notes here..."
          rows={6}
          style={{ width: "100%" }}
        />
      </div>

      {/* Documents */}
      <div className="card">
        <h3>Documents</h3>
        <input type="file" multiple onChange={onSelectDocs} accept=".pdf,.png,.jpg,.jpeg,.txt" />
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16, marginTop: 12 }}>
          <div className="card" style={{ padding: 8, maxHeight: 320, overflow: "auto" }}>
            <strong>Files</strong>
            <ul>
              {docs.map((d, i) => (
                <li key={i}>
                  <button
                    style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setActiveDoc(d)}
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: 0, minHeight: 320 }}>
            {!activeDoc ? (
              <div style={{ padding: 12, color: "#666" }}>No document selected.</div>
            ) : activeDoc.type === "application/pdf" ? (
              <iframe
                title={activeDoc.name}
                src={activeDoc.url}
                style={{ width: "100%", height: 480, border: "none" }}
              />
            ) : activeDoc.type.startsWith("image/") ? (
              <img src={activeDoc.url} alt={activeDoc.name} style={{ maxWidth: "100%", maxHeight: 480, objectFit: "contain" }} />
            ) : (
              <iframe title={activeDoc.name} src={activeDoc.url} style={{ width: "100%", height: 480, border: "none" }} />
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={saveSession}>Save Session (local)</button>
      </div>
    </div>
  );
};

export default SessionRecorder;
