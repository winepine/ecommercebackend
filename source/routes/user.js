const express=require('express')
const { signup, signin, requireSignin }=require('../controllers/user');
const{validateSignup, validateSignin, isRequestValidated}=require('../validator/auth');
const router=express.Router()


//get post wagera are asal mein routes
//both sign in and sign out are post functions

router.post('/signup', validateSignup, isRequestValidated, signup)
    //first find from User schema if user already exists);

router.post('/signin', validateSignin, isRequestValidated, signin)
    //THIS SETS AN OBJECT - 'USER'
router.post('/homepage', requireSignin, (req,res)=>{
    res.status(200).json({user: 'welcome to profile'})
})


module.exports=router;