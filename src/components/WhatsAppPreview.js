export default function WhatsAppPreview({ header, body, buttons }) {
  return (
    <div
      style={{
        width: 320,
        border: "1px solid #ddd",
        borderRadius: 10,
        padding: 12,
        background: "#e5ddd5",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 10,
        }}
      >
        {header && (
          <div style={{ fontWeight: "bold", marginBottom: 6, color: "#111" }}>
            {header}
          </div>
        )}

        <div style={{ fontSize: 14, marginBottom: 10, color: "#111" }}>
          {body || "Message body will appear here"}
        </div>

        {buttons?.length > 0 && (
          <div>
            {buttons.map((btn, i) => (
              <div
                key={i}
                style={{
                  marginTop: 6,
                  padding: "8px 10px",
                  borderTop: "1px solid #eee",
                  color: "#075e54",
                  textAlign: "center",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {btn.text || "Button"}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
