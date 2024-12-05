const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUser);

// router.get("/", getUsers);
// router.get("/:userId", getUserById);
// router.post("/", createUser);

module.exports = router;
