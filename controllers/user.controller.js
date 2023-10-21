const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const nodemailer = require("nodemailer");

//tous les users
module.exports.getAllUsers = async (req, res) => {
  //Dans userModel trouve les datas et select tout sauf password
  const users = await UserModel.find().select("-password");

  res.status(200).json(users);
};

//pour infos static
module.exports.getAdmin = async (req, res) => {
  const user = await UserModel.findOne({ role: 1 })
    .select("-password")
    .select("-role");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(200).json({ error: "Pas d'admin" });
  }
};

//un seul user pour quand un est connecté
module.exports.userConnecting = async (req, res) => {
  //   console.log(req.params);
  //si id n'existe pas
  if (!ObjectID.isValid(req.params.id))
    return res.status(200).send(`id inconnu dans la base : ${req.params.id}`);

  //si id exist
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log(`id inconnu : ${err}`);
  }).select("-password");
};

//update user connecting
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res
      .status(200)
      .json({ message: `id inconnu pour le update : ${req.params.id}` });

  //le new : true permet d'ajouter un nouveau champs si besoin
  //avec ça on bloque pas la base de donnée
  // return;
  const { pseudo, localisation, title, description } = req.body;
  if (!pseudo || !localisation || !title || !description)
    return res
      .status(200)
      .json({ message: "Erreur : Les champs sont vides bro" });
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user)
      return res
        .status(200)
        .json({ message: `Erreur : ${req.params.id} non reconnu` });
    const updateUser = await UserModel.findByIdAndUpdate(user, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Mise à jour effectuée" });

    //old methode 👇👆
    //cette méthode fait que si le champs est vide il sera quand même
    //envoyé et sera vide dans la database
    // UserModel.findOneAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $set: {
    //       pseudo: req.body.pseudo,
    //       localisation: req.body.localisation,
    //       title: req.body.title,
    //       description: req.body.description,
    //     },
    //   },
    //   { new: true, upsert: true, setDefaultsOnInsert: true },
    //   (err, docs) => {
    //     if (!err) return res.status(200).send(docs);
    //     if (err) return res.status(200).send({ error: err });
    //   }
    //   ).select("-password");
    //old methode 👆
  } catch (err) {
    return res.status(200).json({ error: err });
  }
};

//delete user
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res
      .status(400)
      .send(`id inconnu pour la suppréssion : ${req.params.id}`);

  try {
    UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Suppréssion réussie." });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

//init mdp send email if pasword forget
module.exports.initPass = async (req, res) => {
  let mailcatch = req.params.email;
  const length = 10;
  let newPassword = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*+?";
  for (let i = 0; i < length; i++) {
    //passwordgenere automatique
    newPassword += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  // Send the email
  try {
    const email = await UserModel.checkEmail(mailcatch); //on vérifie si existe

    //on modifie le mdp
    email.password = newPassword;
    await email.save();
    //create un transporter avec gmail service
    //le mdp ici doit etre en env cela a été généré automatic de gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nisethscary@gmail.com",
        pass: "jitqqwakzcftbyig",
      },
    });
    // Create the email options
    const mailOptions = {
      from: "nisethscary@gmail.com",
      to: mailcatch,
      subject: "Test email",
      text:
        "Initialisation de votre mot de passe. Voici un  votre mot de passe temporaire : " +
        newPassword +
        " Modifier votre mot de passe une fois connecté",
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error to send mail " + error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Email envoyé à " + mailcatch });
      }
    });
  } catch (error) {
    console.log("Error dans letry catch  " + error);
    res.status(200).json({ message: `${mailcatch}, ${error}` });
  }
};

//userconnect and he want to change mot de passe
module.exports.changePass = async (req, res) => {
  console.log(req.body.email);
  console.log(req.body.oldpass);
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res
        .status(200)
        .json({ message: "Erreur : Cet user inconnu " + req.params.id });
    }

    const userAuth = await UserModel.loginConnect(
      req.body.email,
      req.body.oldpass
    );
    if (!userAuth) {
      res.status(200).json({ message: "Erreur mot de passe incorrect" });
    }
    //ici on change le mot de passe
    user.password = req.body.password;
    await user.save();

    // res.send("Password updated successfully");
    res
      .status(200)
      .json({ message: "Mot de passe a été modifié avec succès." });
  } catch (err) {
    console.log(err);
    // console.log(err);
    res.status(200).json({ message: "Erreur : Ancien mot de passe incorrect" });
  }
};
