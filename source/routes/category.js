const express= require('express');

const { createCategory, getCategory, requireSignin, adminCategory} = require('../controllers/category');
const router= express.Router();

router.post('/category/create', requireSignin, adminCategory, createCategory)
router.get('/category/categories', getCategory)

module.exports=router;