"use client";
import { useEffect, useState } from "react";
import WhatsAppPreview from "@/components/WhatsAppPreview";

export default function TemplatesPage() {
  // Form state
  const [name, setName] = useState("");
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [buttons, setButtons] = useState([]);

  // Existing templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch("/api/templates", {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
    });
    const data = await res.json();
    setTemplates(data);
  };

  const addButton = () => {
    setButtons([...buttons, { type: "reply", text: "" }]);
  };

  const saveTemplate = async () => {
    if (!name || !body) {
      alert("Template name and body are required");
      return;
    }

    await fetch("/api/templates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify({
        name,
        header,
        body,
        buttons,
      }),
    });

    alert("Template saved");

    setName("");
    setHeader("");
    setBody("");
    setButtons([]);
    setSelectedTemplateId("");

    fetchTemplates();
  };

  const handleTemplateSelect = (id) => {
    setSelectedTemplateId(id);

    const tpl = templates.find(t => String(t.id) === String(id));
    if (!tpl) return;

    setName(tpl.name || "");
    setHeader(tpl.header || "");
    setBody(tpl.body || "");
    setButtons(tpl.buttons ? JSON.parse(tpl.buttons) : []);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* LEFT CARD – TEMPLATE FORM */}
        <div style={styles.card}>
          <h2 style={styles.heading}>Create / Edit Template</h2>

          <div style={styles.field}>
            <label style={styles.label}>Template Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Welcome Template"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Header (optional)</label>
            <input
              value={header}
              onChange={e => setHeader(e.target.value)}
              placeholder="Welcome 👋"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Message Body</label>
            <textarea
              rows={5}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Hi {{name}}, welcome to our service."
              style={styles.textarea}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Buttons</label>
            {buttons.map((btn, i) => (
              <input
                key={i}
                value={btn.text}
                placeholder={`Button ${i + 1}`}
                onChange={e => {
                  const copy = [...buttons];
                  copy[i].text = e.target.value;
                  setButtons(copy);
                }}
                style={{ ...styles.input, marginBottom: 6 }}
              />
            ))}
            <button onClick={addButton} style={styles.secondaryButton}>
              + Add Button
            </button>
          </div>

          <button onClick={saveTemplate} style={styles.primaryButton}>
            Save Template
          </button>
        </div>

        {/* RIGHT CARD – PREVIEW */}
        <div style={styles.card}>
          <h2 style={styles.heading}>Preview</h2>

          <div style={styles.field}>
            <label style={styles.label}>Select Existing Template</label>
            <select
              value={selectedTemplateId}
              onChange={e => handleTemplateSelect(e.target.value)}
              style={styles.input}
            >
              <option value="">Select template</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <WhatsAppPreview
              header={header}
              body={body}
              buttons={buttons}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: 20,
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    gap: 30,
    flexWrap: "wrap",
  },
  card: {
    background: "#fff",
    flex: 1,
    minWidth: 320,
    padding: 24,
    borderRadius: 10,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  heading: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 600,
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
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
    resize: "vertical",
  },
  primaryButton: {
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
  secondaryButton: {
    marginTop: 8,
    padding: "8px 12px",
    // background: "#eee",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
};
