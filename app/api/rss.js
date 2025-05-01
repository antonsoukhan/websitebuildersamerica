import { NextResponse } from "next/server";
import RSS from "rss";
import connectDB from "@/lib/db"; // adjust path if needed
import Post from "@/models/Post"; // adjust path if needed

export async function GET() {
  await connectDB();

  const posts = await Post.find().sort({ createdAt: -1 });

  const feed = new RSS({
    title: "Website Builders America Blog",
    description: "Latest updates and insights",
    site_url: "https://websitebuildersamerica.com", // update if needed
    feed_url: "https://websitebuildersamerica.com/rss.xml",
    language: "en",
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.content,
      url: `https://websitebuildersamerica.com/blog/${post.slug}`,
      date: post.createdAt,
    });
  });

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
