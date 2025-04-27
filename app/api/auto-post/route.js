import { NextResponse } from "next/server";
import OpenAI from "openai"; // ✅ NEW v4 import
import connectDB from "@/lib/db"; // your MongoDB connection
import Post from "@/models/Post"; // your Mongoose Post model

export async function POST() {
  try {
    await connectDB();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompts = [
      "Write a 1000-word blog post giving small businesses SEO tips to improve website ranking in 2024.",
      "Write a 1000-word blog post about how to get more clients using Instagram and Facebook marketing.",
      "Write a 1000-word blog post explaining 5 simple web design improvements that boost SEO rankings.",
      "Write a 1000-word blog post about optimizing Google Business Profile to attract more local clients.",
    ];

    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: randomPrompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedContent = response.choices[0].message.content;

    const titleMatch = generatedContent.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : "New Blog Post";

    const newPost = new Post({
      title: title,
      content: generatedContent.replace(/^# .+$/m, ""),
      createdAt: new Date(),
    });

    await newPost.save();

    return NextResponse.json({ success: true, message: "Post created" });
  } catch (error) {
    console.error("Error auto-posting:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  }
}
