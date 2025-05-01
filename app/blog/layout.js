"use client";

import { createContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Correct for App Router

// Create Context
export const SearchContext = createContext("");

export default function BlogLayout({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const router = useRouter();

  const handleArchiveClick = () => {
    setArchiveLoading(true);
    router.push("/blog/archive");

    // ✅ Reset loading after short delay (fallback since App Router has no router.events)
    setTimeout(() => {
      setArchiveLoading(false);
    }, 1500); // adjust time as needed
  };

  return (
    <SearchContext.Provider value={searchQuery}>
      <div className="forum-layout" style={{ display: "flex" }}>
        {/* Desktop Sidebar */}
        <aside
          className="forum-sidebar"
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
            <Link
              href="/blog"
              style={{ textDecoration: "none", color: "#000" }}
            >
              YOUR BLOG
            </Link>
          </h1>
          <p
            style={{ fontSize: "0.9rem", color: "#777", marginBottom: "20px" }}
          >
            by You
          </p>

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

          <button
            onClick={handleArchiveClick}
            disabled={archiveLoading}
            style={{
              marginTop: "30px",
              fontSize: "0.9rem",
              color: "#000",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: archiveLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {archiveLoading ? (
              <>
                <span
                  className="spinner"
                  style={{ width: "16px", height: "16px" }}
                ></span>
                Loading...
              </>
            ) : (
              "View Archive"
            )}
          </button>
        </aside>

        {/* Main Column */}
        <div style={{ flex: 1 }}>
          {/* Mobile Accordion */}
          <div className="mobile-forum-menu" style={{ padding: "1rem" }}>
            <details
              open={isAccordionOpen}
              onToggle={(e) => setIsAccordionOpen(e.target.open)}
            >
              <summary className="mobile-forum-toggle">
                {isAccordionOpen ? "✕ Close Menu" : "☰ Open Menu"}
              </summary>

              <div className="mobile-forum-content">
                <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
                  <Link
                    href="/blog"
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    YOUR BLOG
                  </Link>
                </h1>
                <p style={{ fontSize: "0.9rem", color: "#777" }}>by You</p>

                <input
                  type="text"
                  placeholder="Search blog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    margin: "1rem 0",
                    padding: "8px 10px",
                    width: "100%",
                    fontSize: "0.9rem",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />

                <form
                  action="https://buttondown.email/api/emails/embed-subscribe/website_builders_america"
                  method="post"
                  target="_blank"
                  style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}
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

                <button
                  onClick={handleArchiveClick}
                  disabled={archiveLoading}
                  style={{
                    fontSize: "0.9rem",
                    color: "#000",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: archiveLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {archiveLoading ? (
                    <>
                      <span
                        className="spinner"
                        style={{ width: "16px", height: "16px" }}
                      ></span>
                      Loading...
                    </>
                  ) : (
                    "View Archive"
                  )}
                </button>
              </div>
            </details>
          </div>

          {/* Blog Content */}
          <main className="forum-main">{children}</main>
        </div>
      </div>
    </SearchContext.Provider>
  );
}
