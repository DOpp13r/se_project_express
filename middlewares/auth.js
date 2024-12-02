const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_SC } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const auth = (req, res, next) => {
  const excludedRoutes = ["/signin", "/signup", "/items"]; // Skip authorizations for ...
  if (excludedRoutes.includes(req.originalUrl)) {
    return next();
  }

  const authorization = req.headers.authorizations;

  if (!authorization) {
    return res.status(UNAUTHORIZED_SC.code).json(UNAUTHORIZED_SC.message);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(UNAUTHORIZED_SC.code).json({ message: "Invalid token" });
  }
};

module.exports = auth;
