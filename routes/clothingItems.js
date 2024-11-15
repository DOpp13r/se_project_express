const router = require("express").Router();

router.get("/", () => console.log("GET clothingItems"));
router.post("/", () => console.log("POST clothingItems"));
router.delete("/:itemId", () => console.log("DELETE clothingItem by ID"));

module.exports = router;
