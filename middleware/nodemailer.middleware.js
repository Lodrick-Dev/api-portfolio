const nodemailer = require("nodemailer");

// Configuration du transporteur
module.exports.transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nisethscary@gmail.com",
    pass: "jitqqwakzcftbyig",
  },
});
