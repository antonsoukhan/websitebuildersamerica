"use client";
import PostIcons from "../components/PostIcons"; // Adjust the path if needed
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "./layout"; // 👈 import your context

async function fetchPosts() {
  const res = await fetch("/api/posts");
  const data = await res.json();
  return data;
}

export default function BlogPage() {
  const searchQuery = useContext(SearchContext); // 👈 get searchQuery from context
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const allPosts = await fetchPosts();
      setPosts(allPosts);
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
    <div className="blog-container">
      {filteredPosts.length > 0 ? (
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
        <p>No matching posts found.</p>
      )}
    </div>
  );
}
