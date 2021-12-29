const express = require("express");
const { requireSignin } = require("../controllers/user.js");
const { addItem, getCart } = require("../controllers/cart");
const router = express.Router();

router.post("/cart/addItem", requireSignin, addItem);
router.post('/cart/viewcart', getCart);

module.exports = router;
