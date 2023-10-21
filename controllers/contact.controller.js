const nodemailer = require("nodemailer");
const { transporter } = require("../middleware/nodemailer.middleware");

//check is email is valide
function isValidEmail(email) {
  // Expression régulière pour valider une adresse e-mail
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

module.exports.contactClient = async (req, res, next) => {
  // Utilisez le transporteur pour envoyer un e-mail
  const { hidden, emailCatch, text, name } = req.body;
  if (hidden)
    return res.status(200).json({ message: "Erreur : lol robot 🤖🤖" });

  //   return;
  if (!emailCatch || !text || !name)
    return res
      .status(200)
      .json({ message: "Erreur : Tous les champs sont nécessaires bro " });

  //check email
  if (!isValidEmail(emailCatch))
    return res.status(200).json({ message: "Erreur : Email invalide" });

  //email
  const mailOptions = {
    from: "nisethscary@gmail.com",
    to: "dev.frenchlod@gmail.com",
    subject: "Contact portfolio",
    text: `
    Nom : ${name},
    Message : ${text}
    `,
    replyTo: emailCatch,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erreur lors de l'envoi de l'e-mail : " + error);
      res.status(500).json({ message: "Erreur lors de l'envoi de l'e-mail" });
    } else {
      console.log("E-mail envoyé : " + info.response);
      res.status(200).json({ message: "E-mail envoyé avec succès" });
    }
  });
};
