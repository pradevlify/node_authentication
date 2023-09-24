const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
require("./db/conn");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("server connected successfully");
});
