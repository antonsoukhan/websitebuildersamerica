"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId ? `/api/posts/${editingId}` : "/api/posts";

    await fetch(endpoint, {
      method,
      body: JSON.stringify({
        title,
        slug,
        content,
        category,
        tags: tags.split(",").map((t) => t.trim()), // Convert to array
      }),
    });
  };

  const handleDelete = async (id) => {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });
    fetchPosts();
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setEditingId(post._id);
    setCategory(post.category || "");
    setTags(post.tags?.join(", ") || "");
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <input
          placeholder="Category (e.g., Tech)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          placeholder="Slug (e.g., my-first-post)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "10px", height: "100px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: editingId ? "#ffa726" : "#26a69a",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update Post" : "Create Post"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setSlug("");
              setContent("");
            }}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "#ccc",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Posts</h2>
      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small style={{ color: "#888" }}>Slug: {post.slug}</small>
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => handleEdit(post)}
              style={{
                marginRight: "10px",
                padding: "5px 10px",
                backgroundColor: "#42a5f5",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(post._id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#ef5350",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
