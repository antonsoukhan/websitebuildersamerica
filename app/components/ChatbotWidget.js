"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Stable sessionId per tab
  const sessionIdRef = useRef(null);
  if (!sessionIdRef.current) {
    sessionIdRef.current =
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }
  const sessionId = sessionIdRef.current;

  // Helper: POST to API
  const postChat = async (body) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Chat API error");
    return res.json();
  };

  // Finalize (email full transcript on close)
  const finalizedRef = useRef(false);
  const finalizeLead = async () => {
    if (finalizedRef.current) return;
    try {
      await postChat({ sessionId, finalize: true, conversation: messages });
    } catch (e) {
      console.error("Finalize error:", e);
    } finally {
      finalizedRef.current = true;
    }
  };

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close on ESC
  useEffect(() => {
    const onKey = async (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        await finalizeLead();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, messages]);

  // Finalize on page unload
  useEffect(() => {
    const handler = () => {
      try {
        const payload = JSON.stringify({
          sessionId,
          finalize: true,
          conversation: messages,
        });
        navigator.sendBeacon?.(
          "/api/chat",
          new Blob([payload], { type: "application/json" })
        );
      } catch {}
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [messages, sessionId]);

  // Optional: auto-finalize after 60s inactivity while open
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => finalizeLead(), 60000);
    return () => clearTimeout(t);
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    finalizedRef.current = false; // user continued chat

    try {
      const data = await postChat({
        sessionId,
        message: text,
        conversation: next,
      });
      const reply = data.reply || "";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Toggle open: finalize + close when already open
  const toggleOpen = async () => {
    if (isOpen) {
      await finalizeLead();
      setIsOpen(false);
    } else {
      setIsOpen(true);
      if (messages.length === 0) {
        setMessages([
          {
            role: "assistant",
            content:
              "Hi! I can help you book a website consultation. What’s your full name and the best phone or email to reach you?",
          },
        ]);
      }
    }
  };

  // Header close handler (X button)
  const handleCloseClick = async () => {
    await finalizeLead();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Bubble */}
      <div
        className="floating-chatbot-button"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: 10001,
        }}
      >
        <button
          onClick={toggleOpen}
          aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
          style={{
            fontSize: "2rem",
            width: "3.6rem",
            height: "3.6rem",
            borderRadius: "50%",
            backgroundColor: "#26baee",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          💬
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Website Builders America Chat"
          style={{
            position: "fixed",
            bottom: "6rem",
            right: "1rem",
            width: "350px",
            height: "500px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Header with title + close (X) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.5rem 0.75rem",
              borderBottom: "1px solid #eee",
              background: "#f9f9f9",
            }}
          >
            <div style={{ fontWeight: 600 }}>
              Chat with Website Builders America
            </div>
            <button
              onClick={handleCloseClick}
              aria-label="Close Chat"
              title="Close"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.25rem",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "0.5rem",
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "10px",
                    backgroundColor: m.role === "user" ? "#26baee" : "#eee",
                    color: m.role === "user" ? "#fff" : "#000",
                    fontSize:
                      typeof window !== "undefined" && window.innerWidth > 768
                        ? "1.1rem"
                        : "0.95rem",
                    lineHeight: "1.4",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                  }}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  textAlign: "left",
                  fontStyle: "italic",
                  color: "#666",
                  fontSize: "0.9rem",
                }}
              >
                Assistant is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              padding: "0.5rem",
            }}
          >
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                finalizedRef.current = false;
              }}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#26baee",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
