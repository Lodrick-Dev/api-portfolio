const router = require("express").Router();
const { contactClient } = require("../controllers/contact.controller");

router.post("/mail", contactClient);

module.exports = router;
