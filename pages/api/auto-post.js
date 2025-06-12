import OpenAI from "openai";
import connectDB from "@/lib/db"; // Keep using your existing lib
import Post from "@/models/Post"; // Your Mongoose model

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    const titleMatch = generatedContent.match(/^Title:\s*(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled Post";

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const contentWithoutTitle = generatedContent
      .replace(/^Title:.*$/m, "")
      .trim();

    const newPost = new Post({
      title,
      slug,
      content: contentWithoutTitle,
      createdAt: new Date(),
    });

    await newPost.save();

    return res.status(200).json({ success: true, message: "Post created" });
  } catch (error) {
    console.error("Auto-post error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create post" });
  }
}
