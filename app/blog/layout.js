"use client";

import { createContext, useState } from "react";
import Link from "next/link";

// Create Context
export const SearchContext = createContext("");

export default function BlogLayout({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SearchContext.Provider value={searchQuery}>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            width: "250px",
            padding: "40px 20px",
            borderRight: "1px solid #ddd",
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
            <Link href="/" style={{ textDecoration: "none", color: "#000" }}>
              YOUR BLOG
            </Link>
          </h1>
          <p
            style={{ fontSize: "0.9rem", color: "#777", marginBottom: "20px" }}
          >
            by You
          </p>

          {/* Inline Search Bar */}
          <input
            type="text"
            placeholder="Search blog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              marginBottom: "20px",
              padding: "8px 10px",
              width: "100%",
              fontSize: "0.9rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />

          {/* Subscribe Form */}
          <form
            action="https://buttondown.email/api/emails/embed-subscribe/website_builders_america"
            method="post"
            target="_blank"
            style={{ display: "flex", gap: "6px", marginTop: "20px" }}
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              style={{
                padding: "6px 8px",
                fontSize: "0.85rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "140px",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                fontSize: "0.85rem",
                padding: "6px 12px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Subscribe
            </button>
          </form>

          {/* Archive link */}
          <Link
            href="/blog/archive"
            style={{
              marginTop: "30px",
              fontSize: "0.9rem",
              color: "#000",
              textDecoration: "underline",
            }}
          >
            View Archive
          </Link>
        </aside>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: "60px 40px",
            maxWidth: "700px",
          }}
        >
          {children} {/* ✅ Just render children normally */}
        </main>
      </div>
    </SearchContext.Provider>
  );
}
