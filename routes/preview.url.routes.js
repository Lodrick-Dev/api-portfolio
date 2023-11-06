const router = require("express").Router();
const { previewUrl } = require("../controllers/preview.url");
router.get("/url", previewUrl);
module.exports = router;
