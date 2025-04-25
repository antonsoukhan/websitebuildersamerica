import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(req) {
  await connectDB();
  const { title, content, slug } = await req.json();

  const post = await Post.create({ title, content, slug });

  // ✅ ONLY send email after creating a post
  await fetch("https://api.buttondown.email/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      subject: title,
      body: `${content}\n\n[Read more](https://yourwebsite.com/blog/${slug})`,
      publish_date: new Date().toISOString(),
    }),
  });

  return NextResponse.json(post);
}
