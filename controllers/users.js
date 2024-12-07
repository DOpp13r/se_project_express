const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_SC,
  UNAUTHORIZED_SC,
  NOT_FOUND_SC,
  DUPLICATE_ERROR_SC,
  SERVER_ERROR_SC,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_SC.code)
      .json({ message: "Email and password are required" });
  }

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(DUPLICATE_ERROR_SC.code)
        .json({ message: "Email is already in use" });
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) =>
        User.create({
          name,
          avatar,
          email,
          password: hash,
        })
      )
      .then((user) =>
        res.status(201).send({
          user: {
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          },
        })
      )
      .catch((err) => {
        console.log(err);
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST_SC.code)
            .send({ message: BAD_REQUEST_SC.message });
        }
        return res
          .status(SERVER_ERROR_SC.code)
          .send({ message: SERVER_ERROR_SC.message });
      });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_SC.code)
      .json({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "Invalid email or password") {
        return res
          .status(UNAUTHORIZED_SC.code)
          .send({ message: UNAUTHORIZED_SC.message });
      }
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) =>
      res.send({
        user: { name: user.name, avatar: user.avatar, email: user.email },
      })
    )
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) =>
      res.send({ user: { name: user.name, avatar: user.avatar } })
    )
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: NOT_FOUND_SC.message });
      }
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

module.exports = { createUser, login, getCurrentUser, updateUser };
