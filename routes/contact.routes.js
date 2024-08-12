const router = require("express").Router();
const {
  contactClient,
  subscribeCm,
} = require("../controllers/contact.controller");

router.post("/mail", contactClient);
router.post("/subscribe", subscribeCm);

module.exports = router;
