const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const auth = require("./authController");

// POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password using bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({ username, email, password: hashedPassword });

  // Confirm user was created and send back user data
  if (user) {
    res.status(201).json({
      username: user.username,
      token: auth.generateJWT(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// POST /api/users/login
// Includes authentication
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user to get hashed password
  const user = await User.findOne({ email });

  // Compare entered password and hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      username: user.username,
      token: auth.generateJWT(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid login credentials");
  }
});

// GET /api/users/me
// Get user data
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, getMe };
