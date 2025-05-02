import jwt from "jsonwebtoken";
const JWT_SECRET = "anakinskywalker"

export const authMiddleware = (req, res, next) => {

  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
 
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error); 
    res.status(400).json({ message: "Invalid token." });
  }
};
