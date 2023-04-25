const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// protect routes
const requireLogin = asyncHandler(async (req, res, next) => {
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
      const decodedObject = jwt.verify(token, process.env.JWT_KEY);
      if(!decodedObject){
        return res.status(401);
      }

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

module.exports = requireLogin;