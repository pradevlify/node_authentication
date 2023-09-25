const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

employeeSchema.methods.gentoken = async function (req, res) {
  try {
    const ctoken = jwt.sign({ _id: this._id.toString() }, process.env.SECRET);
    this.tokens = this.tokens.concat({ token: ctoken });
    console.log("this is token :" + ctoken);
    await this.save();
    return ctoken;
  } catch (e) {
    res.send("something wrong");
    console.log(e.message);
  }
};

employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
    console.log("encrypted password :" + this.password);
    console.log("encrypted cpassword :" + this.cpassword);
  }
  next();
});

const emodel = mongoose.model("employees", employeeSchema);
module.exports = emodel;
