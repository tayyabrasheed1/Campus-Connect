const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Not authorized: token missing" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized: user not found" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Account is suspended" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized: invalid token" });
  }
};

const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");
    if (user && !user.isSuspended) {
      req.user = user;
    }
    return next();
  } catch (error) {
    return next();
  }
};

const protect = verifyToken;

module.exports = { verifyToken, protect, optionalProtect };
