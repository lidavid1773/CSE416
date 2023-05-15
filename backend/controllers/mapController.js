// Instead of having to constantly implement a try & catch block for each async function, we want to reuse our error handler
//  which we made to override the default express error handler (errorMiddleware)
const asyncHandler = require("express-async-handler");

const Map = require("../models/mapModel");
const User = require("../models/userModel");
const { ObjectId } = require("mongodb");

// GET /api/maps/getOne/:mapId
const getMap = asyncHandler(async (req, res) => {
  const map = await Map.findOne({
    _id: new ObjectId(req.params.mapId),
  }).populate("user");

  if (!map) {
    res.status(400);
    throw new Error("Map not found");
  }

  res.status(200).json(map);
});

// GET /api/maps
const getMaps = asyncHandler(async (req, res) => {
  const maps = await Map.find({ user: req.user.id });
  res.status(200).json(maps);
});

// POST /api/maps
const setMap = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add a title field");
  }

  const map = await Map.create({ user: req.user.id, title: req.body.title });
  res.status(200).json(map);
});

// GET /api/maps/searchMapsBy/:username
const searchMapsBy = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    res.status(200).json([]);
    return;
  }

  const maps = await Map.find({ user: user._id });

  res.status(200).json(maps);
});

// PUT /api/maps/:mapId
const updateMap = asyncHandler(async (req, res) => {
  const map = await Map.findById(req.params.mapId);

  if (!map) {
    res.status(400);
    throw new Error("Map not found");
  }

  const user = req.user;

  // If user doesn't exist
  if (!user) {
    res.status(401);
    throw new Error("User doesn't exist");
  }

  // Check if logged in user is the same as the map's user
  if (map.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedMap = await Map.findByIdAndUpdate(req.params.mapId, req.body, {
    new: true,
  });

  res.status(200).json(updatedMap);
});

// DEL /api/maps/:mapId
const deleteMap = asyncHandler(async (req, res) => {
  const map = await Map.findById(req.params.mapId);

  if (!map) {
    res.status(400);
    throw new Error("Map not found");
  }

  const user = req.user;

  // If user doesn't exist
  if (!user) {
    res.status(401);
    throw new Error("User doesn't exist");
  }

  // Check if logged in user is the same as the map's user
  if (map.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await map.deleteOne();

  res.status(200).json({ mapId: req.params.mapId });
});

module.exports = {
  getMap,
  getMaps,
  searchMapsBy,
  setMap,
  updateMap,
  deleteMap,
};
