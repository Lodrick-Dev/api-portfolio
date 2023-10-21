const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URLI, () =>
      console.log("Mongo connecté")
    );
  } catch (error) {
    console.log("Erreur sur la connection mongoDB" + error);
    process.exit();
  }
};

module.exports = connectDB;
