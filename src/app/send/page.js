"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SendPage() {

  const router = useRouter();

  const [templates, setTemplates] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/templates", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    })
      .then(res => res.json())
      .then(data => setTemplates(data));
  }, []);

  const sendMessage = async () => {
    if (!templateId || !phone) {
      alert("Please select a template and enter phone number");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/send-whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify({
        templateId,
        phone,
        variables: { name },
      }),
    });

    setLoading(false);

    const data = await res.json();
    if (data.success) alert("WhatsApp message sent successfully!");
    else alert("Failed to send message");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 10,
            background: "transparent",
            border: "none",
            color: "#1677ff",
            cursor: "pointer",
            fontSize: 13,
            padding: 0,
          }}
        >
          ← Back to Templates
        </button>

        <h2 style={styles.heading}>Send WhatsApp Message</h2>

        {/* Template */}
        <div style={styles.field}>
          <label style={styles.label}>Template</label>
          <select
            value={templateId}
            onChange={e => setTemplateId(e.target.value)}
            style={styles.input}
          >
            <option value="">Select a template</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div style={styles.field}>
          <label style={styles.label}>Recipient Phone</label>
          <input
            placeholder="+91XXXXXXXXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Variable */}
        <div style={styles.field}>
          <label style={styles.label}>Name (variable)</label>
          <input
            placeholder="Shreyas"
            value={name}
            onChange={e => setName(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Action */}
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Sending..." : "Send WhatsApp"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 600,
    textAlign: "center",
    color: "#111",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 500,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#25D366",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
