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

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) =>
      res.send({
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      })
    )
    .catch((err) => {
      console.log(err);
      return res
        .status(SERVER_ERROR_SC.code)
        .send({ message: SERVER_ERROR_SC.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_SC.code)
      .send({ message: "All fields are required" });
  }

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res
        .status(DUPLICATE_ERROR_SC.code)
        .send({ message: "Email already exists" });
    }

    return bcrypt
      .hash(password, 10)
      .then((hashedPassword) =>
        User.create({
          name,
          avatar,
          email,
          password: hashedPassword,
        })
      )
      .then((user) =>
        res.send({
          user: { name: user.name, email: user.email, avatar: user.avatar },
        })
      )
      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          return res
            .status(DUPLICATE_ERROR_SC.code)
            .send({ message: DUPLICATE_ERROR_SC.message });
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
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_SC.code)
      .send({ message: BAD_REQUEST_SC.message });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(UNAUTHORIZED_SC.code)
        .send({ message: UNAUTHORIZED_SC.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) =>
      res.send({
        user: {
          name: user.name,
          avatar: user.avatar,
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
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
