const router = require("express").Router();
const postController = require("../controllers/post.controller");
const { checkUser, isAdmin } = require("../middleware/auth.middleware");
const multer = require("multer");

//pour envoyer le fichier directement dans le dossier sans controle ni renommé
//"dest"
// const upload = multer({ dest: "./client/public/uploads/post" });
//pour controller la destination du fichier et le renommé "diskStorage"
//le cb est un callBack
let rename = "";
const pathUpload = "D:/devweb/NodeJs/portfolio/client/public/uploads/posts";
//si on veut stocker sur le serveur
const storageAndRename = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!pathUpload) {
      cb(new Error("Chemin n'existe pas"), false);
    }
    cb(null, pathUpload);
  },
  filename: (req, file, cb) => {
    // const ext = path.extname(file.originalname);
    // rename = req.params.id + ".jpg";
    rename = "image.jpg";
    cb(null, rename);
  },
});

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

//si on veut stocker dans le serveur
const upload = multer({
  storage: storageAndRename,
  fileFilter: fileFilterImg,
});

//si on veut pas stocker dans le serveur
const storageNot = multer.memoryStorage(); // Utilise la mémoire pour stocker les fichiers temporairement

const uploadNoStock = multer({
  storage: storageNot,
  fileFilter: fileFilterImg,
});
//fin traitementn image

//recupérer publication posted
// router.get("/all", checkUser, postController.getAllPosts);
router.get("/all", postController.getAllPosts);

//poster une publication
router.post("/add", checkUser, isAdmin, postController.postNew);

//fonctionne
// router.put("/upload/:id", upload.single("image"), postController.updateImg);

router.put(
  "/upload/:id",
  checkUser,
  isAdmin,
  upload.single("image"),
  postController.updateImg
);

//modification
router.put("/:id", checkUser, isAdmin, postController.updatePost);

//supprimession
router.delete("/:id", checkUser, isAdmin, postController.deletePost);

//echec avec google platforme cloud
// router.post(
//   "/add/img",
//   upload.single("bucketimage"),
//   postController.addImageBucket
// );

//aws
// router.post(
//   "/add/img/aws",
//   uploadNoStock.single("bucketimage"),
//   async (req, res) => {
//     try {
//       await postController.addImgAws;
//     } catch (error) {
//       console.log(error);
//       return res.status(400).send("erreur");
//     }
//   }
// );

//test is ok
router.post(
  "/add/img/aws",
  uploadNoStock.single("bucketimage"),
  postController.addImgAws
);

module.exports = router;
