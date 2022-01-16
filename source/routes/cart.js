const express = require("express");
const { requireSignin } = require("../controllers/user.js");
const { addItem, getCart } = require("../controllers/cart");
const router = express.Router();

router.post("/cart/addItem", requireSignin, addItem);
router.get('/cart/viewcart', getCart);

module.exports = router;
