const express= require('express');

const { requireSignin, verifyAdmin} = require('../controllers/admin/user');
const {createProduct}= require('../controllers/product');

const router= express.Router();

router.post('/product/create', requireSignin, verifyAdmin, createProduct);
router.get('/product/products')

module.exports=router;