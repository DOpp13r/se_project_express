const jwt = require("jsonwebtoken");
const { UNAUTHORIZED_SC } = require("../utils/errors");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const auth = (req, res, next) => {
  const excludedRoutes = ["/signin", "/signup"]; // Skip authorizations for ...
  const isExcluded = excludedRoutes.some((route) =>
    req.originalUrl.startsWith(route)
  );

  if (isExcluded) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED_SC.code).json(UNAUTHORIZED_SC.message);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED_SC.code).json({ message: "Invalid token" });
  }
};

module.exports = auth;
