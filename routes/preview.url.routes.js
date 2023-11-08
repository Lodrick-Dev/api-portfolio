const router = require("express").Router();
const { previewUrl } = require("../controllers/preview.url");
router.post("/url", previewUrl);
module.exports = router;
