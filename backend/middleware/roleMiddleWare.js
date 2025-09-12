const roleMiddleware = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized - No user found" });
      }

      if (req.user.role !== role) {
        return res
          .status(403)
          .json({ message: "Forbidden - Insufficient role" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  };
};

export default roleMiddleware;
