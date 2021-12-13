const express= require('express');
const {requireSignin} = require('../controllers/user.js');
const{addItem}=require('../controllers/cart');
const router= express.Router();

router.post('/cart/addItem', requireSignin, addItem)
//router.get('/cart/categories', getCategory)

module.exports=router;