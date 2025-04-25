"use client";

import { FaTwitter, FaEnvelope, FaRss } from "react-icons/fa";

export default function FloatingIcons() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        zIndex: 999,
      }}
    >
      <a
        href="mailto:you@example.com"
        target="_blank"
        rel="noopener noreferrer"
        style={iconStyle}
      >
        <FaEnvelope />
      </a>
      <a
        href="https://twitter.com/yourhandle"
        target="_blank"
        rel="noopener noreferrer"
        style={iconStyle}
      >
        <FaTwitter />
      </a>
      <a
        href="/rss.xml"
        target="_blank"
        rel="noopener noreferrer"
        style={iconStyle}
      >
        <FaRss />
      </a>
    </div>
  );
}

const iconStyle = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "10px",
  borderRadius: "50%",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "18px",
  textDecoration: "none",
};
