const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 Qui viene impostato req.user
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid token", error: err.message });
  }
};

module.exports = authenticateToken;
