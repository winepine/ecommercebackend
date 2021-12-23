const express = require("express");
var nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const USER = require("../controllers/user");
const User = require("../models/user"); // imported user schema
const { signup, signin, requireSignin } = require("../controllers/user");
const {
  validateSignup,
  validateSignin,
  isRequestValidated,
} = require("../validator/auth");
const router = express.Router();

//get post wagera are asal mein routes
//both sign in and sign out are post functions

router.post("/signup", validateSignup, isRequestValidated, signup);
//first find from User schema if user already exists);

router.post("/signin", validateSignin, isRequestValidated, signin);
//THIS SETS AN OBJECT - 'USER'
router.get("/homepage", (req, res) => {
  if (req.query.authorization) {
    const token = req.query.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_KEY);
    req.user = user;
    return res.status(200).json(user);
  } else {
    return res.status(400).json({
      message: "User is not authorized",
    });
  }
});
//update the password here
router.post("/update-password", async (req, res) => {
  const { password, password2, email } = req.body;
  console.log(password);
  console.log(password2);
  var salt = await bcrypt.genSalt(12);
  var hash = await bcrypt.hash(password, salt);
  //await USER.findOneAndUpdate({ email: email }, { $set: { USER.token: Token } })
  await User.findOneAndUpdate(
    { email: email },
    { $set: { hashed_password: hash } }
  );
  res.redirect("/homepage");
});

//creating a link for password reset adn sending to email
router.post("/reset-password", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail", //targeting gmail
    auth: {
      //providing authentication
      user: "rabia.shabbir444@gmail.com",
      pass: "imtoocute1",
    },
  });

  //sendout email
  //bodyof email
  //var url = "http://localhost:4000/user/reset-password?token=" + token;
  var mailOptions = {
    from: "rabia.shabbir444@gmail.com",
    to: req.body.email,
    subject: "RESET YOUR PASSWORD",
    text:
      `Click on this link to reset your password http://localhost:4000/api/update-password` +
      req.body.token,
    // html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  };

  //passingmailoptions
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      //checking error
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});
module.exports = router;
