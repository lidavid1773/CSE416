const express = require("express");
const router = express.Router();

const {
  getMaps,
  setMap,
  updateMap,
  deleteMap,
} = require("../controllers/mapController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getMaps);
router.post("/", protect, setMap);
router.put("/:id", protect, updateMap);
router.delete("/:id", protect, deleteMap);

module.exports = router;
