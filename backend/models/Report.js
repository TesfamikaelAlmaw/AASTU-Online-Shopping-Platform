import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reported_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
  },
  reported_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reporter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved"],
    default: "pending",
  },
});

export default mongoose.model("Report", reportSchema);
