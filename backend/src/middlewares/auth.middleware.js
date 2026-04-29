const jwt = require('jsonwebtoken');

// 1. Verify JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // The token usually comes in the format "Bearer [TOKEN]"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = verified; // Attach the user payload to the request
    next(); // Pass control to the next function
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// 2. Role-Based Access Control (RBAC)
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Access Denied. Requires ${role} role.` });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };