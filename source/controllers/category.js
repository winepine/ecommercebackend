const Category = require("../models/catagory"); // schema for categories
const slugify = require("slugify"); // this is used to create a unique category;
const jwt = require("jsonwebtoken");
exports.createCategory = (req, res) => {
  const obj = {
    name: req.body.name,
    slug: slugify(req.body.name),
  };
  if (req.body.parentId) {
    obj.parentId = req.body.parentId;
  }
  const NewCategory = new Category(obj);
  NewCategory.save((err, data) => {
    if (err) {
      return res.status(400).json({
        message: "Category could not be created",
      });
    } else {
      return res.status(200).json({
        message: "Category successfully created",
        data,
      });
    }
  });
};
exports.getCategory = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    } else {
      res.status(200).json({
        data,
      });
    }
  });
};
exports.requireSignin = (req, res, next) => {
  if (req.query.authorization) {
    const token = req.query.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_KEY);
    req.user = user;
  } else {
    return res.status(400).json({
      message: "User is not authorized",
    });
  }
  next();
};
exports.userCategory = (req, res, next) => {
  if (req.body.role !== "user") {
    return res.status(400).json({
      message: "Access for User Only ",
    });
  }
  next();
};
exports.adminCategory = (req, res, next) => {
  if (req.body.role !== "admin") {
    return res.status(400).json({
      message: "Access for Admin Only ",
    });
  }
  next();
};
