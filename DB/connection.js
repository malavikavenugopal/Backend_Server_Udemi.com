const mongoose = require("mongoose");

const connectionString = process.env.DATABSE;

mongoose.connect(connectionString)
  .then((res) => {
    console.log("mongoDB connected successfully");
  })
  .catch((err) => {
    console.log(`mongoDB connection failed due to ${err}`);
  })
