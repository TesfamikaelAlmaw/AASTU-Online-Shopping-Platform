import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    // match: /.+@aastu\.edu\.et$/ // only university emails
  },
  password: { type: String, required: true }, // hashed
  department: { type: String },
  profile_picture: { type: String }, // URL
  contact_number: { type: String },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  date_joined: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
});

export default mongoose.model("User", userSchema);
