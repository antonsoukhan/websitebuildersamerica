"use client";

import { FaTwitter, FaEnvelope, FaRss } from "react-icons/fa";

export default function PostIcons() {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <a
        href="mailto:websitebuildersamerica@gmail.com"
        title="Email"
        style={iconStyle}
      >
        <FaEnvelope />
      </a>
      <a
        href="https://twitter.com/WebBuilders_USA"
        target="_blank"
        rel="noopener noreferrer"
        title="Twitter"
        style={iconStyle}
      >
        <FaTwitter />
      </a>
      <a href="/rss.xml" title="RSS Feed" style={iconStyle}>
        <FaRss />
      </a>
    </div>
  );
}

const iconStyle = {
  color: "#333",
  fontSize: "1.4rem",
  textDecoration: "none",
};
