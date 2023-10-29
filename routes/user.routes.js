const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const { isAdmin, checkUser } = require("../middleware/auth.middleware");
const { blockIpMiddleware, checkIP } = require("../middleware/ipblock");
// const upload = multer();

//premier parametre est la suite de l'url du server pour le user
//post pour envoyé, get pour obtenir, put pour modifier
//delete pour supprimer
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser, blockIpMiddleware);
router.get("/logout", authController.logoutUser);

//gestion user
router.get("/all", userController.getAllUsers);
router.get("/static", userController.getAdmin);
router.get("/:id", userController.userConnecting);
router.put("/:id", checkUser, isAdmin, userController.updateUser); //update
router.delete("/:id", checkUser, isAdmin, userController.deleteUser); //delete
router.put("/init/:email", userController.initPass); //to send mail init
router.put("/:id/password", checkUser, isAdmin, userController.changePass); //to change pass

//*************des test  avec postman/
//**le req est ce que l'utilisateur envoi dans les inputs
//**Les premier parametre sont la suite de ce qu'il y aura dans l'url après
//**ce qu'il y aura dans les premiers paramtre de app.use(server.js)
//router.get("/", (req, res) => {
//   res.json({ message: "Voici les donnée en get a l'accueil" });
// });
// router.post("/", (req, res) => {
//   res.json({ message: req.body.message });
// });
//**pour faire une mise a jour on prend le id
//**req.params.id c'est l'id qui vient du url
// router.put("/:id", (req, res) => {
//   res.json({ messageId: req.params.id });
// });

// router.delete("/:id", (req, res) => {
//   res.json({ message: "post supprimé id :" + req.params.id });
// });

module.exports = router;
