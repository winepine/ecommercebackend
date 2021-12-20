const express = require("express");

const { requireSignin, verifyAdmin } = require("../controllers/admin/user");
const { createProduct, getProduct } = require("../controllers/product");
const multer = require("multer");
const shortid = require("shortid");
const path = require("path");
const router = express.Router();
//multer is always configured on the router

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/Users/basitsaeed/Public/root/ecommercebackend/source/pictures");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //cb(null, file.fieldname + '-' + uniqueSuffix)
    cb(null, file.originalname);
  },
});
const picture = multer({ storage: storage });

router.post(
  "/product/create",
  requireSignin,
  verifyAdmin,
  picture.array("image"),
  createProduct
);
router.get("/product/products", getProduct);

module.exports = router;
