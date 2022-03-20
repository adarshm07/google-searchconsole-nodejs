const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://user:uq2X9yQPBwFyy3T6@cluster0.aylhp.mongodb.net/db?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });
