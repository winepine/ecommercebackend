const express=require('express')
const {signup, signin, requireSignin }=require('../../controllers/admin/user');
const{validateSignup, validateSignin, isRequestValidated}=require('../../validator/auth');
const router=express.Router()


//get post wagera are asal mein routes
//both sign in and sign out are post functions

router.post('/admin/signup', validateSignup, isRequestValidated, signup)
    //first find from User schema if user already exists);

router.post('/admin/signin', validateSignin, isRequestValidated, signin)
    //THIS SETS AN OBJECT - 'USER'



module.exports=router;