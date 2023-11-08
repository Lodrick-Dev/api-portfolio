const router = require("express").Router();
const multer = require("multer");
const { checkUser, isAdmin } = require("../middleware/auth.middleware");
const {
  addImagePost,
  deleteImagePost,
} = require("../controllers/imagePost.controller");

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
// router.post(
//   "/upload/aws",
//   checkUser,
//   isAdmin,
//   uploadNoStock.single("imagepost"),
//   addImagePost
// );

//link utilisé pour portfolio new design
router.put(
  "/update/img/:id",
  checkUser,
  isAdmin,
  uploadNoStock.single("imgpostupload"),
  addImagePost
);

// router.delete(
//   "/delete/objet/post/aws/:id",
//   checkUser,
//   isAdmin,
//   deleteImagePost
// );

module.exports = router;
