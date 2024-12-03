const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use("/", mainRouter);

app.use((err, req, res) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.use(cors());
app.post("/signin", login);
app.post("/signup", createUser);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
