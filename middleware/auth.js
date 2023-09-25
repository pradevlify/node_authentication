const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwt = require("jsonwebtoken");
const register = require("../model/model");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.authtoken;
    const verifyuser = jwt.verify(token, process.env.SECRET);
    const user = await register.findOne({ _id: verifyuser._id });
    console.log("authenticated user" + user);
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = auth;
