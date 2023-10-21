const mongoose = require("mongoose");
const ipSchema = new mongoose.Schema(
  {
    ipblocks: {
      type: String,
    },
    loginattempts: {
      type: Number,
    },
    expire: {
      type: Number,
    },
  },
  { timestamps: true }
);
const IpModel = mongoose.model("ip", ipSchema);
module.exports = IpModel;
