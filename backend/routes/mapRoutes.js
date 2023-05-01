const express = require("express");
const router = express.Router();

const {
  getMap,
  getMaps,
  setMap,
  updateMap,
  deleteMap,
} = require("../controllers/mapController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMaps);
router.post("/", protect, setMap);
router.put("/:mapId", protect, updateMap);
router.delete("/:mapId", protect, deleteMap);
router.get("/getOne/:mapId", protect, getMap);

module.exports = router;
