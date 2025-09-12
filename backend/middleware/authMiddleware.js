import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // attach user info to req.user (similar to Laravel's $request->user())
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden - Invalid token" });
  }
};

export default authenticateJWT;
