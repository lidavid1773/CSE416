const jwt = require("jsonwebtoken");

// Generate json webtoken
const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { generateJWT };
