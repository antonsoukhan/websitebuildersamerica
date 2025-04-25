import connectDB from "@/lib/db";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import PostIcons from "@/app/components/PostIcons"; // or adjust path

export default async function BlogPost(props) {
  const params = await props?.params;

  await connectDB();
  const post = await Post.findOne({ slug: params.slug });
  if (!post) return notFound();

  return (
    <>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{post.title}</h1>
      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "40px" }}>
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
      <PostIcons />
    </>
  );
}
