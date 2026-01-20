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

  // Fetch templates on load
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

    // Reset form
    setName("");
    setHeader("");
    setBody("");
    setButtons([]);

    // Refresh dropdown
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
    <div style={{ display: "flex", gap: 40, padding: 20 }}>

      {/* LEFT: TEMPLATE FORM */}
      <div style={{ width: 400 }}>
        <h2>Create / Edit WhatsApp Template</h2>

        <input
          placeholder="Template Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "100%" }}
        />

        <br /><br />

        <input
          placeholder="Header (optional)"
          value={header}
          onChange={e => setHeader(e.target.value)}
          style={{ width: "100%" }}
        />

        <br /><br />

        <textarea
          placeholder="Message Body"
          rows={5}
          value={body}
          onChange={e => setBody(e.target.value)}
          style={{ width: "100%" }}
        />

        <br /><br />

        <h4>Buttons</h4>
        {buttons.map((btn, i) => (
          <input
            key={i}
            placeholder={`Button ${i + 1}`}
            value={btn.text}
            onChange={e => {
              const copy = [...buttons];
              copy[i].text = e.target.value;
              setButtons(copy);
            }}
            style={{ width: "100%", marginBottom: 6 }}
          />
        ))}

        <button onClick={addButton}>Add Button</button>

        <br /><br />
        <button onClick={saveTemplate}>Save Template</button>
      </div>

      {/* RIGHT: PREVIEW + TEMPLATE SELECT */}
      <div>
        <h3>WhatsApp Preview</h3>

        <br />

        <select
          value={selectedTemplateId}
          onChange={e => handleTemplateSelect(e.target.value)}
          style={{ width: 320 }}
        >
          <option value="">Select saved template</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <br /><br />

        <WhatsAppPreview
          header={header}
          body={body}
          buttons={buttons}
        />

        {/* <br />

        <h4>Preview Existing Template</h4> */}
        
      </div>

    </div>
  );
}
