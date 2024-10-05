import jwt from 'jsonwebtoken';

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1]; 

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    req.user = decoded.userId;

    next(); 
  } catch (error) {
    console.error(error?.message || "Invalid or expired token");

    return res.status(401).json({
      error: error?.message || "Invalid or expired token"
    });
  }
};
