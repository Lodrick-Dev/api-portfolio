const mongoose = require("mongoose");
const { isEmail } = require("validator"); //fonction qui envoi true ou false
const bcrypt = require("bcrypt");

//trim permet de supprimé les espace à la fin qui est inutile
//isEmail dans tableau
const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    default: "Marc Doe",
    minlength: 3,
    maxLength: 55,
    // unique: true,
    // sparse: true, // Permet d'avoir des valeurs en double, mais ne prend pas en compte les valeurs nulles/vides pour l'unicité
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail],
    lowercase: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    minlength: 6,
  },
  picture: {
    type: String,
    default: "/public/other/profil/profil.png",
  },
  localisation: {
    type: String,
    max: 1024,
    minlength: 3,
    trim: true,
  },
  title: {
    type: String,
    max: 1024,
    minlength: 6,
  },
  description: {
    type: String,
    max: 1024,
  },
  role: {
    type: Number,
    trim: true,
    default: 0,
  },
});

//on hash le mdp avant d'envoyer dans la base de donnée
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(); //on genere le sell
  this.password = await bcrypt.hash(this.password, salt); //on hash avec le sel
  next(); //qui veut dire passe à la suite
});

//pour savoir si le user existe avec le mail et pour
//comparé le mdp envoyé par le user et le mdp en base de donnée
userSchema.statics.loginConnect = async function (email, password) {
  const user = await this.findOne({ email });
  // console.log(user);
  // console.log(user.password);
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    // console.log(auth);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

//to init mot de passe checki if email existe
userSchema.statics.checkEmail = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email incorrect ou n'existe pas");
  } else {
    return user;
  }
};

//'user' est le nom de la table qui sera créer dans la base de donnée
const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
