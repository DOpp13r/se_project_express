const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_SC,
  UNAUTHORIZED_SC,
  NOT_FOUND_SC,
  DUPLICATE_ERROR_SC,
  SERVER_ERROR_SC,
} = require("../utils/errors");

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.log(err);
//       return res
//         .status(SERVER_ERROR_SC.code)
//         .send({ message: SERVER_ERROR_SC.message });
//     });
// };

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((data) => {
      const user = {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };
      if (!user) {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: NOT_FOUND_SC.message });
      }
      return res.status(200).send(user);
    })
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
      .send({ message: BAD_REQUEST_SC.message });
  }

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status
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
        .then((user) => {
          const { password: UserPassword, ...userWithoutPassword } =
            user.toObject();
          return res.status(201).send(userWithoutPassword);
        })
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
    })
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
};

// const getUserById = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.log(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(NOT_FOUND_SC.code)
//           .send({ message: NOT_FOUND_SC.message });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(BAD_REQUEST_SC.code)
//           .send({ message: BAD_REQUEST_SC.message });
//       }
//       return res
//         .status(SERVER_ERROR_SC.code)
//         .send({ message: SERVER_ERROR_SC.message });
//     });
// };

// const findUserByCredentials = (email, password) => {
//   return User.findOne({ email })
//     .select("+password")
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error("User not found"));
//       }
//       return bcrypt.compare(password, user.password).then((isMatch) => {
//         if (!isMatch) {
//           return Promise.reject(new Error("Invalid email or password"));
//         }
//         return user;
//       });
//     });
// };

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
    .then((data) => {
      const updatedUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      };
      if (!updatedUser) {
        return res
          .status(NOT_FOUND_SC.code)
          .send({ message: NOT_FOUND_SC.message });
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_SC.code)
          .send({ message: BAD_REQUEST_SC.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_SC.code)
        .send({ message: INTERNAL_SERVER_ERROR_SC.message });
    });
};

module.exports = {
  // getUsers,
  createUser,
  getCurrentUser,
  // getUserById,
  // findUserByCredentials,
  login,
  updateProfile,
};
