const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND_SC } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_SC.code).send({ message: "Router not found" });
});

module.exports = router;
