const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUserById,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.get("/me", updateProfile);
// router.get("/", getUsers);
// router.get("/:userId", getUserById);
// router.post("/", createUser);

module.exports = router;
