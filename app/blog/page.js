import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Link from "next/link";

export default async function BlogPage() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });

  return (
    <>
      {posts.map((post) => (
        <article key={post._id} style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
            {post.title}
          </h2>
          <p
            style={{ fontSize: "0.85rem", color: "#777", marginBottom: "20px" }}
          >
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{ fontSize: "1.05rem", lineHeight: "1.7" }}
          />
          <hr style={{ marginTop: "40px", borderColor: "#eee" }} />
        </article>
      ))}
    </>
  );
}
