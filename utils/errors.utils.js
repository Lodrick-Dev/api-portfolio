module.exports.registerErrors = (err) => {
  // let errors = { pseudo: "", email: "", password: "" };
  // if (err.message.includes("pseudo")) errors.pseudo = "Pseudo existe déjà";
  // if (err.message.includes("email")) errors.email = "Email existe déjà";
  // if (err.message.includes("password"))
  // errors.password = "Votre mot de passe doit contenir 6 cractères minimum";
  // if (err.message.includes("code")) errors.code = "Code incorrect ";
  let errors = { message: "" };
  if (err.message.includes("pseudo")) errors.message = "Pseudo existe déjà";
  if (err.message.includes("email")) errors.message = "Email existe déjà";
  if (err.message.includes("password"))
    errors.message = "Mot de passe doit contenir 6 caractères minimum";

  //Object.key // pour la clé de err et [0] pour le premier element
  // if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
  //   errors.pseudo = "Pseudo déjà connu";
  // if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
  //   errors.email = "Email déjà connu";
  // return errors;

  //Object.key // pour la clé de err et [0] pour le premier element
  // if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
  //   errors.message = "Pseudo déjà connu";
  // if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
  //   errors;
  // errors.message = "Email déjà connu";
  // console.log(errors);
  return errors;
};

//pour login
module.exports.loginErrors = (err) => {
  let errors = { fatal: "" };
  if (err.message.includes("email"))
    errors.fatal = "Email/Mdp incorrect ou inconnu";
  if (err.message.includes("password"))
    errors.fatal = "Mdp/email incorrect ou inconnu";
  return errors;
};

//pour upload profil
module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };
  if (err.message.includes("Invalide file"))
    errors.format = "Format attendu incorrect";

  if (err.message.includes("Max size"))
    errors.maxSize = "Le fichier dépasse 500ko";
  return errors;
};
