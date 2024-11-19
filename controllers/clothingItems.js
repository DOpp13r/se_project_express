const mongoose = require("mongoose");
const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_SC,
  NOT_FOUND_SC,
  SERVER_ERROR_SC,
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

  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({ message: "Item deleted" }))
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

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_SC.code;
      throw error;
    })
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
      res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  console.log(`Disliking item with ID: ${itemId}`);

  // Validate the itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(BAD_REQUEST_SC.code)
      .send({ message: BAD_REQUEST_SC.message });
  }

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_SC.code;
      throw error;
    })
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
      if (err.statusCode === NOT_FOUND_SC.code) {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: NOT_FOUND_SC.message });
      }
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
