const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/projectreg", {
    useNewUrlParser: true,
  })
  .then((d) => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e.message);
  });

