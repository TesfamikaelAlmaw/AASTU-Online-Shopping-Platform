import { addItem } from "../controllers/itemControllers.js";
import express from "express";
const router = express.Router();
router.post("/add", addItem);
export default router;
