const mongoose = require("mongoose");
const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_SC,
  NOT_FOUND_SC,
  SERVER_ERROR_SC,
  FORBIDDEN_SC,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch(() => {
      res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_SC.code)
          .send({ message: BAD_REQUEST_SC.message });
      }
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  const userId = req.user._id;

  return clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN_SC.code)
          .send({ message: "User not authorized to delete item" });
      }

      return clothingItem
        .findByIdAndDelete(itemId)
        .orFail()
        .then((deletedItem) =>
          res.status(200).send({ deletedItem, message: "Item deleted" })
        )
        .catch((err) => {
          console.error(err);
          return res
            .status(SERVER_ERROR_SC.code)
            .send({ message: SERVER_ERROR_SC.message });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: NOT_FOUND_SC.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_SC.code)
          .send({ message: BAD_REQUEST_SC.message });
      }
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);

  // Validate the itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(BAD_REQUEST_SC.code)
      .send({ message: BAD_REQUEST_SC.message });
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: "Item not found" });
      }
      return res.status(200).send({ item });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  // Validate the itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(BAD_REQUEST_SC.code)
      .send({ message: BAD_REQUEST_SC.message });
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: "Item not found" });
      }
      return res.status(200).send({ item });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
