const jwt = require("jsonwebtoken");
const AuthenticationError = require("../exceptions/AuthenticationError");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError("Missing authentication");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    
    req.auth = decoded;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new AuthenticationError("Token tidak valid");
  }
};

module.exports = authMiddleware;
