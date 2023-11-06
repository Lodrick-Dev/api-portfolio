//dans ce fichier il aura l'enregistrement du user la connexion et la deconnexion

//req.body vient du front
//res est la réponse du req
//create() est une méthode qui vient de mongoose
const UserModel = require("../models/user.model");
const IpModel = require("../models/ip.model");
const jwt = require("jsonwebtoken");
const { registerErrors, loginErrors } = require("../utils/errors.utils");

//fonction qui crée un token
//sign() vient de jwt
//3 * 24 * 60 * 60 * 1000 signifie trois jours
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.registerUser = async (req, res) => {
  const { email, password, code } = req.body;
  if (!email || !password || !code) {
    return res.status(200).json({ error: "Veuillez remplir les champs" });
  }
  try {
    if (code === process.env.CODE_DISCRET) {
      const user = await UserModel.create({
        email,
        password,
      });
      res.status(200).json({ message: "Inscription réussi !" });
    } else {
      return res.status(200).json({ error: "Code secret incorrect" });
    }
  } catch (error) {
    console.log(error);
    console.log("------fin du log---------");
    if (error.errors) {
      if (error.errors.email) {
        if (error.errors.email.properties.message)
          return res.status(200).json({ error: "Email incorrect" });
      }
    }
    // if (
    //   error.errors.password.properties.message.includes(
    //     "shorter than the minimum"
    //   )
    // )
    //   return res
    //     .status(200)
    //     .json({ error: "Mot de passe trop court, max 6 caractères" });
    const errors = registerErrors(error);
    res.status(200).json({ errors }); //pour voir comment les erreurs sont envoyé
    // return res.status(200).send(registerErrors(error));
  }
};

//login user
module.exports.loginUser = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ipData = await IpModel.findOne({ ipblocks: ip });
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(200)
      .json({ error: "Veuillez remplir les champs pour vous connecter" });
  }
  try {
    const user = await UserModel.loginConnect(email, password);
    const token = createToken(user._id); //a activé pour le token

    //on envoi dans les cookies avec comme clé 'jwt'
    //httpOnly sur true pour dire que dans notre serveur
    //maxAge est le temps pour expiration
    //pour le local c'est :
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    //pour le cookie en local la ligne 77
    //a activé pour le cookie avec vrai nom de domaine :
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   maxAge,
    //   domain: ".lodrick-web.fr",
    //   secure: true,
    // });
    //a activé pour le cookie avec vrai nom de domaine
    if (ipData) {
      ipData.remove();
    }

    res.status(200).json({ user: user._id });
    // console.log("Co good");
  } catch (error) {
    // console.log(error);
    const errors = loginErrors(error);
    // const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // const ipData = await IpModel.findOne({ ipblocks: ip });
    //
    if (ipData) {
      //existe déjà
      const nbTentative = await ipData.loginattempts; // nombre de tentativ
      const expire = await ipData.expire; // timestamp
      if (nbTentative >= 3) {
        //si y a déjà 3 tentative
        if (expire > new Date(Date.now())) {
          return res.status(200).json({ redirection: "ok" });
        }
      } else {
        res.status(200).send({ errors });
        next();
      }
    } else {
      res.status(200).send({ errors });
    }
    next(); //pour aller inscrire l'ip dans database
    // next();
  }
};

//logout user
module.exports.logoutUser = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  //pour vrai site :
  // res.cookie("jwt", "", {
  //   maxAge: 1,
  //   domain: ".lodrick-web.xyz",
  //   path: "/",
  // });
  //pour vrai site
  res.status(200).json({ message: "redirection" });
};
