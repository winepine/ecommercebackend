const Product = require("../models/products"); // imported user schema
const slugify = require("slugify");
const Category=require("../models/category")
exports.createProduct = (req, res) => {
  console.log(req.body.name);
  const {
    name,
    price,
    description,
    category,
    creator,
    brand,
    quantity,
    review,
  } = req.body;
  let pictures = [];
  if (req.files.length > 0) {
    pictures = req.files.map(file => {
      return { img: file.filename };
    });
  }
  const obj = new Product({
    name: name,
    slug: slugify(name),
    brand: brand,
    price: price,
    description: description,
    image: pictures,
    quantity: quantity,
    review: review,
  });
  obj.save((error, user) => {
    if (error) {
      console.log(error);
      return res.status(404).json({
        message: "Product could not be registered",
      });
    }
    if (user) {
      res.status(200).json({
        user,
      });
    }
  });
};
exports.getProduct = (req, res) => {
  const{slug}=req.body.slug;
  Category.findOne({slug:slug}).exec((error, category)=>{
    if(error){
      return res.status(401).json({message:"Category undefined"});
    }
    if(category){
      Product.find({category:category._id}).exec((error,products)=>{
        res.status.json({
          products
        });
      });
    }
  });
};
