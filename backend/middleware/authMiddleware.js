const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check authorization header to make sure it is a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Ignore "Bearer" from header to get token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decodedObject = jwt.verify(token, process.env.JWT_SECRET);

      // Get user info from the token
      // Set it to req.user so that we can access req.user in any protected route
      // Remove the hashed password from the object. There is no need for it
      req.user = await User.findById(decodedObject.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No token: Not authorizated");
  }
});

module.exports = { protect };
