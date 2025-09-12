import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  profile_photo: {
    type: String,
    allowNull: true,
  },
  cover_photo: {
    type: String,
    allowNull: true,
  },
  contact_number: {
    type: String,
    allowNull: true,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  date_joined: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active",
  },
});

export default mongoose.model("User", userSchema);
