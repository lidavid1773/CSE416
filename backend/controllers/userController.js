const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAPWORKSHOP_EMAIL,
    pass: process.env.MAPWORKSHOP_PASSWORD,
  },
});

// POST /api/users/forgot-password
const sendResetLink = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please enter an email");
  }

  const user = await User.findOne({ email });

  if (user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const baseURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : process.env.HEROKU_APP_NAME;

    const mailOptions = {
      from: process.env.MAPWORKSHOP_EMAIL,
      to: email,
      subject: "MapWorkshop - Password Reset Link",
      text: `This link will only be available for 15 minutes ${baseURL}reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email.", error);
        res.status(400);
        throw new Error("Error sending email.");
      } else {
        console.log("Email successfully sent.", info.response);
        res.status(201).json("Email successfully sent.");
      }
    });
  } else {
    res.status(400);
    throw new Error("Invalid email");
  }

  res.status(201).json(email);
});

// POST /api/users/reset-password/:id/:token
const updatePassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ _id: id });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  // Add a token field for user schema to verify token

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const setNewPassword = await User.findByIdAndUpdate(
    { _id: id },
    { password: hashedPassword }
  );

  setNewPassword.save();
});

// GET /api/users/me
// Get user data
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  sendResetLink,
  updatePassword,
};
