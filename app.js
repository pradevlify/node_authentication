const express = require("express");
const app = express();
const model = require("./model/model");
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieparser = require("cookie-parser");
const staticpath = path.join(__dirname, "./public/css");
const auth = require("./middleware/auth");

app.use(express.static(staticpath));
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const empmodel = new model({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        phone: req.body.phone,
        email: req.body.email,
        gender: req.body.gender,
        username: req.body.username,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      const token = await empmodel.gentoken();
      res.cookie("authtoken", token, {
        expires: new Date(Date.now() + 70000),
        httpOnly: true,
      });

      const result = await empmodel.save();
      res.status(201).render("home");
    } else {
      res.render("wrongpass");
    }
  } catch (e) {
    res.send(e.message);
  }
});

app.get("/secret", auth, (req, res) => {
  console.log(`secret page token +${req.cookies.authtoken}`);
  res.render("secret");
});

app.get("/login", async (req, res) => {
  res.status(200).render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await model.findOne({ email: email });
    const ismatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.gentoken();

    res.cookie("authtoken", token, {
      expires: new Date(Date.now() + 70000),
      httpOnly: true,
    });

    if (ismatch) {
      res.status(200).render("home");
    } else {
      res.status(400).render("wrongpass");
    }
  } catch (e) {
    res.status(400).render("wrongpass");
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((element) => {
      return element.token !== req.token;
    });

    // logout for single user
    // req.user.tokens = [];

    res.clearCookie("authtoken");
    await req.user.save();
    res.render("login");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// app
module.exports = app;
