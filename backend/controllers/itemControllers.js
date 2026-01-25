import express from "express";
import jwtoken from "jsonwebtoken";
import User from "../models/User.js";
import Items from "../models/Item.js";

// adding items
export const addItem = async (req, res) => {
  const { name, price, description } = req.body;
  const owner_id = "68a70e2b821f4cbedbcd2ae2";
  try {
    const newItem = new Items({
      name,
      price,
      description,
      owner_id,
      category_id: req.body.category_id,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error });
  }
};
