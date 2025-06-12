export const dynamic = "force-dynamic";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import Link from "next/link";

export default async function ArchivePage() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });

  return (
    <>
      <h1
        style={{ fontSize: "2rem", textAlign: "center", marginBottom: "40px" }}
      >
        Blog Archive
      </h1>

      {posts.map((post) => (
        <div key={post._id} style={{ marginBottom: "24px" }}>
          <Link
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", color: "#000" }}
          >
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{post.title}</h3>
          </Link>
          <p style={{ fontSize: "0.85rem", color: "#777", margin: 0 }}>
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      ))}
    </>
  );
}
