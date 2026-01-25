import express from "express";
import jwtoken from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
const register = (req, res) => {
  // for debugging purpose
  console.log("Request body:", req.body);
  const user = new User({
    full_name: req.body.full_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    department: req.body.department,
    profile_photo: req.body.profile_photo,
    cover_photo: req.body.cover_photo,
    contact_number: req.body.contact_number,
    role: req.body.role,
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User registered successfully",
        user: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      // Compare password with hashed password
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
      // Generate JWT token
      const token = jwtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        message: "Login successful",
        token,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
export { register, login };
