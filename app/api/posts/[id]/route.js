import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const updated = await Post.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
