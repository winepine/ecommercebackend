const Category = require("../models/catagory"); // schema for categories
const slugify = require("slugify"); // this is used to create a unique category;
const jwt = require("jsonwebtoken");
//New function added
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
let nestedCategory = (category, parentId=null) =>{
  const categoryList = [];
  let categories;
  if(parentId == null){
    categories= category.filter(cat=>cat.parentId == undefined);
  }
  else{
    categories=category.filter(cat=>cat.parentId == parentId)
  }
  for(let i of categories){
    categoryList.push({
      _id: i._id,
      name: i.name,
      slug: i.slug,
      children: nestedCategory(category, i._id)
    })
  }
  return categoryList;
} 
exports.getCategory = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    } 
    if(data){
      const categoryList=nestedCategory(data);
       return res.status(200).json({
        categoryList
      })
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
