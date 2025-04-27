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
      "Write a blog post about SEO tips for small businesses. Make it around 500–700 words. Start with the title on the first line in this format: 'Title: [your catchy blog title here]'. Then write the blog content below.",
      "Write a blog post about how to get more clients using Instagram and Facebook. Make it around 500–700 words. Start with the title on the first line in this format: 'Title: [your catchy blog title here]'. Then write the blog content below.",
      "Write a blog post giving 5 simple web design tips to boost SEO rankings. Make it around 500–700 words. Start with the title on the first line in this format: 'Title: [your catchy blog title here]'. Then write the blog content below.",
      "Write a blog post about optimizing a Google Business Profile to attract more local clients. Make it around 500–700 words. Start with the title on the first line in this format: 'Title: [your catchy blog title here]'. Then write the blog content below.",
    ];

    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: randomPrompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedContent = response.choices[0].message.content;

    // Extract Title
    const titleMatch = generatedContent.match(/^Title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled Post";
    function generateSlug(title) {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric chars
        .trim()
        .replace(/\s+/g, "-"); // Replace spaces with -
    }
    const slug = generateSlug(title);

    // Remove the title line from the content
    const contentWithoutTitle = generatedContent
      .replace(/^Title:.*$/m, "")
      .trim();

    // Save to MongoDB
    const newPost = new Post({
      title: title,
      slug: slug, // ✅ Save the slug too
      content: contentWithoutTitle,
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
