const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const auth = require("../middlewares/auth");

const { NOT_FOUND_SC } = require("../utils/errors");

router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_SC.code).send({ message: "Router not found" });
});

module.exports = router;
