const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const { validateCardBody, validateID } = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", auth, validateCardBody, createItem);
router.delete("/:itemId", auth, validateID, deleteItem);
router.put("/:itemId/likes", auth, validateID, likeItem);
router.delete("/:itemId/likes", auth, validateID, dislikeItem);

module.exports = router;
