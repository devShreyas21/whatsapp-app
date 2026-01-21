"use client";
import { useEffect, useState } from "react";
import WhatsAppPreview from "@/components/WhatsAppPreview";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [buttons, setButtons] = useState([]);

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

  const removeButton = (index) => {
    const copy = [...buttons];
    copy.splice(index, 1);
    setButtons(copy);
  };

  const saveTemplate = async () => {
    if (!name || !body) {
      alert("Template name and body are required");
      return;
    }

    const isEdit = Boolean(selectedTemplateId);

    await fetch("/api/templates", {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify(
        isEdit
          ? { id: selectedTemplateId, name, header, body, buttons }
          : { name, header, body, buttons }
      ),
    });

    alert(isEdit ? "Template updated" : "Template created");

    resetForm();
    fetchTemplates();
  };

  const deleteTemplate = async () => {
    if (!selectedTemplateId) return;

    const confirmDelete = confirm(
      "Are you sure you want to delete this template?"
    );
    if (!confirmDelete) return;

    await fetch("/api/templates", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
      },
      body: JSON.stringify({ id: selectedTemplateId }),
    });

    alert("Template deleted");

    resetForm();
    fetchTemplates();
  };

  const resetForm = () => {
    setName("");
    setHeader("");
    setBody("");
    setButtons([]);
    setSelectedTemplateId("");
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

        {/* LEFT CARD */}
        <div style={styles.card}>
          <h2 style={styles.heading}>
            {selectedTemplateId ? "Edit Template" : "Create Template"}
          </h2>

          <div style={styles.field}>
            <label style={styles.label}>Template Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Header</label>
            <input
              value={header}
              onChange={e => setHeader(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Message Body</label>
            <textarea
              rows={5}
              value={body}
              onChange={e => setBody(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Buttons</label>

            {buttons.map((btn, i) => (
              <div key={i} style={{ display: "flex", gap: 8 }}>
                <input
                  value={btn.text}
                  onChange={e => {
                    const copy = [...buttons];
                    copy[i].text = e.target.value;
                    setButtons(copy);
                  }}
                  style={{ ...styles.input, flex: 1 }}
                />
                <button
                  onClick={() => removeButton(i)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "red",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button onClick={addButton} style={styles.secondaryButton}>
              + Add Button
            </button>
          </div>

          <button onClick={saveTemplate} style={styles.primaryButton}>
            {selectedTemplateId ? "Update Template" : "Save Template"}
          </button>

          {selectedTemplateId && (
            <button
              onClick={deleteTemplate}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px",
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Delete Template
            </button>
          )}
        </div>

        {/* RIGHT CARD */}
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

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button
              onClick={() => router.push("/send")}
              style={{
                padding: "10px 16px",
                background: "#1677ff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Go to Send Message →
            </button>
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
