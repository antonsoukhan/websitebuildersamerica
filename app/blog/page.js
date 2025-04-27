"use client";
import PostIcons from "../components/PostIcons"; // Adjust the path if needed

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
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            <PostIcons></PostIcons>
          </article>
        ))
      ) : (
        <p>No matching posts found.</p>
      )}
    </div>
  );
}
