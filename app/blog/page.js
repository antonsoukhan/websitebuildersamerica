"use client";

import PostIcons from "../components/PostIcons";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "./layout";

async function fetchPosts() {
  const res = await fetch("/api/posts");
  const data = await res.json();
  return data;
}

export default function BlogPage() {
  const searchQuery = useContext(SearchContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const allPosts = await fetchPosts();
      setPosts(allPosts);
      setIsLoading(false);
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const contentMatch = post.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch;
  });

  return (
    <div className="blog-container" style={{ padding: "40px 20px" }}>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div className="spinner" />
          <p style={{ color: "#777", marginTop: "12px" }}>Loading posts...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <article key={post._id} style={{ marginBottom: "40px" }}>
            <h2>{post.title}</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: post.content.substring(0, 300) + "...",
              }}
              style={{ fontSize: "1rem", color: "#555" }}
            />
            <PostIcons />
            <Link
              href={`/blog/${post.slug}`}
              style={{
                display: "inline-block",
                marginTop: "20px",
                color: "#0070f3",
                textDecoration: "underline",
                fontSize: "0.9rem",
              }}
            >
              Read More →
            </Link>
          </article>
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
            No matching posts found
          </h2>
          <p style={{ color: "#666" }}>
            Try changing your search or check back later.
          </p>
        </div>
      )}
    </div>
  );
}
