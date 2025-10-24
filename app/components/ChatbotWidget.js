"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatbotWidget() {
  // ---------------- UI STATE ----------------
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Smart autoscroll state
  const [autoScroll, setAutoScroll] = useState(true); // true when user is near bottom
  const [showNewMsgPill, setShowNewMsgPill] = useState(false);

  // ---------------- REFS ----------------
  const widgetRef = useRef(null);
  const headerRef = useRef(null);
  const messagesWrapRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const swipeStartYRef = useRef(0);

  // Platform flags
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Stable session id per tab
  const sessionIdRef = useRef(null);
  if (!sessionIdRef.current) {
    sessionIdRef.current =
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }
  const sessionId = sessionIdRef.current;

  // ---------------- HELPERS ----------------
  const postChat = async (body) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Chat API error");
    return res.json();
  };

  // Email full transcript once per session end
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

  // ---------------- RESPONSIVE ----------------
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 480 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Dynamic viewport height (baseline)
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  // Android keyboard-aware sizing using visualViewport
  useEffect(() => {
    if (typeof window === "undefined" || !isMobile || !window.visualViewport)
      return;

    const vv = window.visualViewport;
    const apply = () => {
      document.documentElement.style.setProperty("--vvh", `${vv.height}px`);
      // how much bottom area is obscured (keyboard height)
      const kbOffset = Math.max(
        0,
        window.innerHeight - (vv.height + vv.offsetTop)
      );
      document.documentElement.style.setProperty("--vv-bottom", `${kbOffset}px`);
    };
    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
    };
  }, [isMobile]);

  // Keep last message visible while keyboard animates (if already near bottom)
  useEffect(() => {
    if (!isMobile || !window.visualViewport || !messagesWrapRef.current) return;
    const el = messagesWrapRef.current;
    const vv = window.visualViewport;
    const isNearBottom = () =>
      el.scrollHeight - el.scrollTop - el.clientHeight <= 80;

    const onVv = () => {
      if (isNearBottom()) {
        el.scrollTop = el.scrollHeight; // jump to prevent jank during animation
      }
    };
    vv.addEventListener("resize", onVv);
    return () => vv.removeEventListener("resize", onVv);
  }, [isMobile]);

  // ---------------- SCROLL UTILS ----------------
  const nearBottom = () => {
    const el = messagesWrapRef.current;
    if (!el) return true;
    const threshold = 80; // px from bottom counts as "at bottom"
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distance <= threshold;
  };

  const scrollToBottom = (smooth = true) => {
    const el = messagesWrapRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  };

  // Track user scrolling to toggle autoscroll & pill visibility
  useEffect(() => {
    const el = messagesWrapRef.current;
    if (!el) return;

    const onScroll = () => {
      const atBottom = nearBottom();
      setAutoScroll(atBottom);
      if (atBottom) setShowNewMsgPill(false);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ---------------- EFFECTS ----------------
  // Smart autoscroll on new messages
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom(true);
    } else {
      setShowNewMsgPill(true);
    }
  }, [messages]); // run after each message append

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

  // Close on outside click (desktop only)
  useEffect(() => {
    const handleClickOutside = async (e) => {
      if (
        isOpen &&
        widgetRef.current &&
        !widgetRef.current.contains(e.target) &&
        !isMobile
      ) {
        await finalizeLead();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, messages, isMobile]);

  // Best-effort finalize on page unload
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

  // Auto-finalize after 60s inactivity while open
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => finalizeLead(), 60_000);
    return () => clearTimeout(t);
  }, [messages, isOpen]);

  // Swipe down to close (mobile polish)
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

    const el = headerRef.current;
    el.addEventListener("touchstart", onStart);
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [isOpen, isMobile]);

  // ---------------- ACTIONS ----------------
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // preserve autoscroll state based on current position
    setAutoScroll(nearBottom());

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    finalizedRef.current = false;

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
      setTimeout(() => {
        if (autoScroll) scrollToBottom(true);
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
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
      // Only auto-focus on iOS; Android tends to raise keyboard before layout finishes
      setTimeout(() => {
        if (isIOS) inputRef.current?.focus();
      }, 0);
    }
  };

  const handleCloseClick = async () => {
    await finalizeLead();
    setIsOpen(false);
  };

  // ---------------- UI ----------------
  return (
    <>
      {/* Floating bubble — hidden when open to avoid overlap */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            right: "1rem",
            zIndex: 10000,
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

      {/* Chat widget */}
      {isOpen && (
        <div
          ref={widgetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Website Builders America Chat"
          style={{
            position: "fixed",
            // Anchor just above the keyboard on Android; normal offset on desktop
            bottom: isMobile ? "var(--vv-bottom, 0px)" : "1rem",
            right: isMobile ? 0 : "1rem",
            width: isMobile ? "100%" : "360px",
            // Prefer visible viewport height (vvh) -> 100dvh -> --vh fallback
            height: isMobile
              ? "var(--vvh, min(100dvh, calc(var(--vh) * 100)))"
              : "520px",
            borderRadius: isMobile ? 0 : "12px",
            backgroundColor: "#fff",
            border: isMobile ? "none" : "1px solid #ccc",
            boxShadow: isMobile
              ? "0 0 0 rgba(0,0,0,0)"
              : "0 6px 18px rgba(0,0,0,0.25)",
            zIndex: 10002,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily:
              'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
            fontSize: "1.15rem",
            lineHeight: 1.5,
          }}
        >
          {/* Header (also swipe area on mobile) */}
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
            ref={messagesWrapRef}
            style={{
              position: "relative",
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
              background: "#fff",
              WebkitOverflowScrolling: "touch", // iOS smooth scroll
              scrollPaddingBottom: "80px", // keep last bubble visible above keyboard
              overscrollBehavior: "contain", // reduces Android snap
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

            {/* "New message" pill */}
            {showNewMsgPill && (
              <button
                onClick={() => {
                  setShowNewMsgPill(false);
                  setAutoScroll(true);
                  scrollToBottom(true);
                }}
                style={{
                  position: "sticky",
                  bottom: 8,
                  display: "inline-block",
                  margin: "0 auto",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "0.35rem 0.7rem",
                  borderRadius: "999px",
                  border: "1px solid #d6dbe1",
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                New message ↓
              </button>
            )}
          </div>

          {/* Input bar — form submit works great on iOS/Android */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{
              display: "flex",
              gap: "0.5rem",
              borderTop: "1px solid #e6e8eb",
              padding: "0.6rem",
              background: "#fafbfc",
              // extra bottom inset for iPhone home indicator (0 on Android)
              paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom))",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                finalizedRef.current = false;
              }}
              placeholder="Type your message…"
              aria-label="Type your message"
              inputMode="text"
              enterKeyHint="send"
              autoCapitalize="sentences"
              autoCorrect="on"
              onFocus={() => {
                // If they focus while already at bottom, keep autoscroll on
                setAutoScroll(nearBottom());
              }}
              style={{
                flex: 1,
                padding: "0.65rem 0.75rem",
                borderRadius: "10px",
                border: "1px solid "#d6dbe1",
                fontSize: "16px", // prevents iOS zoom; fine on Android
                outline: "none",
                background: "#fff",
              }}
            />
            <button
              type="submit"
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
          </form>
        </div>
      )}
    </>
  );
}
