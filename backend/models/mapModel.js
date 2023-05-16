const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mapSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    geodata: {
      type: Schema.Types.Mixed,
      required: true
    },
    title: {
      type: String,
      required: [true, "Please add a title field"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Map", mapSchema);
