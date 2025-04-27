import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: String,
  slug: String, // ✅ Add slug here
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
