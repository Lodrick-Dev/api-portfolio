const router = require("express").Router();
const updateProfilController = require("../controllers/updateProfil.controller");
const multer = require("multer");
const { checkUser, isAdmin } = require("../middleware/auth.middleware");

//filtrer
const fileFilterImg = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Format non autorisé"), false);
  }
};

//si on veut pas stocker dans le serveur
const storageNot = multer.memoryStorage(); // Utilise la mémoire pour stocker les fichiers temporairement

const uploadNoStock = multer({
  storage: storageNot,
  fileFilter: fileFilterImg,
});
//fin traitementn image

//upload first image profil
//les milieu sont des middleware pour traiter l'image
router.post(
  "/upload/aws",
  checkUser,
  isAdmin,
  uploadNoStock.single("imageprofil"),
  updateProfilController.addFirstImgAws
);

// router.delete(
//   "/delete/objet/aws/:id", //checkUser,
//   //isAdmin,
//   updateProfilController.deleteImgAws
// );

module.exports = router;
