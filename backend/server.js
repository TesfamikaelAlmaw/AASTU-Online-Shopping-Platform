import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authroutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import itemRoutes from "./routes/item.routes.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use("/api/auth", authroutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
