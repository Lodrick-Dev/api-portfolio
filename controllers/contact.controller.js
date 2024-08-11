const nodemailer = require("nodemailer");
const { transporter } = require("../middleware/nodemailer.middleware");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
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

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "nisethscary@gmail.com",
      subject: "Contact portfolio",
      html: `
    <h1> Nom : ${name}</h1>
    <p>mail : ${emailCatch}</p>
    <p>Message : ${text}</p>
  `,
    });
    return res.status(200).json({ message: "Message envoyé ! " });
  } catch (error) {
    console.log(error);
    console.log(
      "une erreur est survenue lors de l'envoie du mail pour dire que subject et text est introuvable"
    );
    return res
      .status(200)
      .json({ message: "Erreur : Une erreur est survenue" });
  }
};
