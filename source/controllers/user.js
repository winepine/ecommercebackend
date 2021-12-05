//sari authetication happens here:
const User = require("../models/user.js"); // imported user schema
const jwt = require("jsonwebtoken");
const session = require("express-session");
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        message: "User already registered",
      });

    var newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      cnic: req.body.cnic,
      email: req.body.email,
      password: req.body.password,
    });

    console.log(newUser);
    // save user
    newUser.save((error, user) => {
      if (error) {
        console.log(error);
        return res.status(404).json({
          message: "User could not be registered",
        });
      }
      /* if(data){
                   return res.status(200).json({
                       user: data
                   })
               }
               */

      if (user) {
        req.session.save((err) => {
          if (err) {
            console.log(err);
            console.log("nhi hoowa");
          } else {
            console.log(req.session.user);
            res.send(req.session.user); // YOU WILL GET THE UUID IN A JSON FORMAT
          }
        });
        //res.json(user);
        return res.status(200).json({
          user,
          message: "User added",
        });
      }
    });
  });
};
exports.signin = async (req, res) => {
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user) {
      /*
      if( user.comparePassword(req.body.password, function(err, isMatch) {
        if (err) 
        console.log(err)
       // throw err;
        console.log(password, isMatch); // -&gt; Password123: true
    })){
      */
      if (user.authenticate(req.body.password)) {
        //generate token

        const token = jwt.sign(
          {
            _id: user._id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        const { _id, firstName, lastName, cnic, email, gender, role } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            firstName,
            lastName,
            email,
            cnic,
            role,
          },
        });
      } else {
        return res.status(404).json({
          message: "Login Failed",
        });
      }
    }
    if (error) {
      return res.status(404).json({
        message: "Sign in not possible",
      });
    }
  });
};
exports.requireSignin = (req, res, next) => {
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
  next();
};
