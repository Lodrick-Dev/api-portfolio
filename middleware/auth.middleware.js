const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
//ces fonction se joue a chque requette envoyé
//qui vérifie si le token utilisé par le user est valide
//check si user connect et si on le connait grace a son token
//dans le token il y a son id
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt; //on lit le cookie grace a cookie-parser

  if (token) {
    //si token exist
    //on vérifie si le token est bien en rapport avec notre token_secret
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        //si y a une erreur on détruit le token
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({
          message: "Bro, y a une erreur avec ton token d'identification",
        });
        // next();
      } else {
        // console.log("decoded token" + decodedToken);
        let user = await UserModel.findById(decodedToken.id)
          .select("-password")
          .select("-role");
        res.locals.user = user;
        // console.log(res.locals.user);
        //avant de next on doit vérifié si il est admin
        next();
      }
    });
  } else {
    res.locals.user = null;
    res.status(200).json({ message: "Bro, veuillez vous connecter" });
    // next();
  }
};

//quand le user se connecte pour la première fois
module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log("====================================");
  // console.log(req);
  // console.log("====================================");
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        //pas de next ici donc ça bloquera toute l'appli
        // console.log("====================================");
        // console.log(err);
        // console.log("====================================");
        return res.status(200).send("Nope");
        // return res.status(401).send("Unauthorized");
      } else {
        //ici il y a next() car token existe
        // console.log(decodedToken.id);
        req.user = await UserModel.findById(decodedToken.id)
          .select("-password")
          .select("-role");
        res.status(200).send(req.user);
        next();
      }
    });
  } else {
    // console.log("====================================");
    // console.log("No token");
    // console.log("====================================");
    return res.status(200).send("Nope find");
    // return res.status(401).send("Unauthorized or not try connect");
  }
};

module.exports.isAdmin = (req, res, next) => {
  // if (res.locals.user.role === 0) {
  //   return res
  //     .status(200)
  //     .json({ error: "Accès interdit, vous devez être admin" });
  // }
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        //pas de next ici donc ça bloquera toute l'appli
        return res.status(200).json({ error: "Error" });
      } else {
        //ici il y a next() car token existe
        // console.log(decodedToken.id);
        const user = await UserModel.findById(decodedToken.id);
        if (user.role === 1) {
          next();
        } else {
          return res
            .status(200)
            .json({ error: "Erreur : Accès interdit, vous devez être admin" });
        }
      }
    });
  } else {
    return res
      .status(200)
      .json({ error: "Error avec le token d'identification" });
  }
  // return res.status(200).json({ error: "Error, token inexistant" });
};
