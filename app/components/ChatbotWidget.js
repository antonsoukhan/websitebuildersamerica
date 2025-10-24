"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatbotWidget() {
  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);
  const headerRef = useRef(null); // for swipe-down on mobile
  const swipeStartYRef = useRef(0);

  // ---- Stable sessionId for this tab ----
  const sessionIdRef = useRef(null);
  if (!sessionIdRef.current) {
    sessionIdRef.current =
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }
  const sessionId = sessionIdRef.current;

  // ---- Helpers ----
  const postChat = async (body) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Chat API error");
    return res.json();
  };

  // Finalize (emails full transcript server-side)
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

  // ---- Responsive (mobile vs desktop) ----
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 480 : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---- Effects ----
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

  // Close when clicking outside the widget (desktop use)
  useEffect(() => {
    const handleClickOutside = async (e) => {
      if (
        isOpen &&
        widgetRef.current &&
        !widgetRef.current.contains(e.target) &&
        !isMobile // on mobile it’s full-screen, so no outside area
      ) {
        await finalizeLead();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, messages, isMobile]);

  // Finalize on page unload (best-effort)
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

  // Optional: auto-finalize after inactivity (60s)
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => finalizeLead(), 60_000);
    return () => clearTimeout(t);
  }, [messages, isOpen]);

  // ---- Actions ----
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    finalizedRef.current = false; // chat continued; allow future finalize

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

  const handleCloseClick = async () => {
    await finalizeLead();
    setIsOpen(false);
  };

  // ---- Swipe-down to close (mobile polish) ----
  useEffect(() => {
    if (!isOpen || !isMobile || !headerRef.current) return;

    const onStart = (e) => {
      swipeStartYRef.current =
        (e.touches && e.touches[0]?.clientY) || e.clientY || 0;
    };
    const onEnd = async (e) => {
      const endY =
        (e.changedTouches && e.changedTouches[0]?.clientY) || e.clientY || 0;
      if (endY - swipeStartYRef.current > 100) {
        await finalizeLead();
        setIsOpen(false);
      }
    };

    const headerEl = headerRef.current;
    headerEl.addEventListener("touchstart", onStart);
    headerEl.addEventListener("touchend", onEnd);

    return () => {
      headerEl.removeEventListener("touchstart", onStart);
      headerEl.removeEventListener("touchend", onEnd);
    };
  }, [isOpen, isMobile]);

  // ---- UI ----
  return (
    <>
      {/* Floating Bubble — hide when open */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 10000, // bubble lower than widget
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={toggleOpen}
            aria-label="Open Chatbot"
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
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          ref={widgetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Website Builders America Chat"
          style={{
            position: "fixed",
            bottom: isMobile ? 0 : "1rem",
            right: isMobile ? 0 : "1rem",
            width: isMobile ? "100%" : "360px",
            height: isMobile ? "100%" : "520px",
            borderRadius: isMobile ? 0 : "12px",
            backgroundColor: "#fff",
            border: isMobile ? "none" : "1px solid #ccc",
            boxShadow: isMobile
              ? "0 0 0 rgba(0,0,0,0)"
              : "0 6px 18px rgba(0,0,0,0.25)",
            zIndex: 10002, // widget above bubble
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily:
              'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
            fontSize: "1.15rem",
            lineHeight: 1.5,
          }}
        >
          {/* Header (draggable area for swipe-down on mobile) */}
          <div
            ref={headerRef}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.6rem 0.9rem",
              borderBottom: "1px solid #eee",
              background: "#f7f9fb",
              touchAction: "pan-y",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>
              Chat with Website Builders America
            </div>
            <button
              onClick={handleCloseClick}
              aria-label="Close Chat"
              title="Close"
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.6rem",
                cursor: "pointer",
                lineHeight: 1,
                color: "#333",
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
              background: "#fff",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "0.6rem",
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "12px",
                    backgroundColor: m.role === "user" ? "#26baee" : "#eef2f6",
                    color: m.role === "user" ? "#fff" : "#111",
                    fontSize:
                      typeof window !== "undefined" && window.innerWidth > 768
                        ? "1.25rem"
                        : "1.1rem",
                    lineHeight: 1.45,
                    maxWidth: "80%",
                    wordBreak: "break-word",
                    boxShadow:
                      m.role === "user"
                        ? "0 2px 8px rgba(38,186,238,0.25)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
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
                  fontSize: "1.05rem",
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
              gap: "0.5rem",
              borderTop: "1px solid #e6e8eb",
              padding: "0.6rem",
              background: "#fafbfc",
            }}
          >
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                finalizedRef.current = false; // user active again
              }}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              aria-label="Type your message"
              style={{
                flex: 1,
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                border: "1px solid #d6dbe1",
                fontSize: "1.15rem",
                outline: "none",
                background: "#fff",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#26baee",
                color: "#fff",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: 600,
                boxShadow: "0 2px 10px rgba(38,186,238,0.25)",
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
