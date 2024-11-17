const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_SC,
  NOT_FOUND_SC,
  SERVER_ERROR_SC,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
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
    .then((item) => res.status(201).send({ data: item }))
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
    .then((item) =>
      res.status(200).send(item, { message: "Item has been deleted" })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: NOT_FOUND_SC.message });
      }
      if (err.name === "RequestError") {
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
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST_SC.code)
          .send({ message: BAD_REQUEST_SC.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: NOT_FOUND_SC.message });
      }
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(BAD_REQUEST_SC.code).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
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
