import connectDB from "@/lib/db";
import Post from "@/models/Post";
import { notFound } from "next/navigation";
import PostIcons from "@/app/components/PostIcons"; // or adjust path
export function generateMetadata({ params }) {
  const { slug } = params;

  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: title,
    description: `Read our article: ${title}`,
    openGraph: {
      title: title,
      description: `Read our article: ${title}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
      type: "article",
    },
    twitter: {
      title: title,
      description: `Read our article: ${title}`,
      card: "summary_large_image",
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = params;

  await connectDB();
  const post = await Post.findOne({ slug });

  if (!post) return notFound();

  return (
    <div style={{ padding: "60px 20px" }}>
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
    </div>
  );
}
