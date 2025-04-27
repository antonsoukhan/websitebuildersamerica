import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://websitebuildersamerica.com"; // ✅ Replace or use env var

  const staticPages = [`${baseUrl}/`, `${baseUrl}/blog`];

  const dynamicPages = posts.map((post) => {
    return `${baseUrl}/blog/${post.slug}`;
  });

  const allPages = [...staticPages, ...dynamicPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((url) => {
      return `
    <url>
      <loc>${url}</loc>
    </url>`;
    })
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
