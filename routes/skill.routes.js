const router = require("express").Router();
const skillController = require("../controllers/skill.controller");
const { checkUser, isAdmin } = require("../middleware/auth.middleware");

router.get("/all", skillController.getskills);
router.post("/add", checkUser, isAdmin, skillController.postSkill);
router.put("/:id", checkUser, isAdmin, skillController.update);
router.delete("/:id", checkUser, isAdmin, skillController.delete);

module.exports = router;
