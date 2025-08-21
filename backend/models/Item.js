import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: { type: Number, required: true },
  images: [{ type: String }], // array of image URLs
  condition: { type: String, enum: ["new", "used"], required: true },
  status: {
    type: String,
    enum: ["available", "sold", "removed"],
    default: "available",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Item", itemSchema);
