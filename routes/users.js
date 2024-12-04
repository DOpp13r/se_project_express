const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.get("/me", updateProfile);

module.exports = router;
