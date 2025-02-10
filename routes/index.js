const router = require("express").Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../utils/errors/NotFoundError");
const {
  validateUserInfo,
  validateLogin,
} = require("../middlewares/validation");

router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateLogin, login);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
