import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/Category.js";
import expres from "express";
const router = expres.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
