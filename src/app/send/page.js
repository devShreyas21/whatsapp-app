"use client";
import { useState, useEffect } from "react";

export default function SendPage() {

    const [templates, setTemplates] = useState([]);
    const [templateId, setTemplateId] = useState("");

    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");

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

        const data = await res.json();
        if (data.success) alert("WhatsApp sent!");
        else alert("Failed");
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Send WhatsApp Message</h2>

            <select
                value={templateId}
                onChange={e => setTemplateId(e.target.value)}
            >
                <option value="">Select Template</option>
                {templates.map(t => (
                    <option key={t.id} value={t.id}>
                        {t.name}
                    </option>
                ))}
            </select>

            <br /><br />

            <input
                placeholder="Phone (+91...)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />
            <br /><br />

            <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <br /><br />

            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
