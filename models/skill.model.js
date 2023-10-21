const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

module.exports = mongoose.model("skill", skillSchema);
