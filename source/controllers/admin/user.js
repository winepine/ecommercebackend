//sari authetication happens here:
const User=require('../../models/user.js')// imported user schema
const jwt= require('jsonwebtoken');
const session = require('express-session');
exports.signup=(req,res)=>{
    User.findOne({ cnic: req.body.cnic}).exec((error,user)=>{
        if(user)
            return res.status(400).json({
                message:'Admin already registered'
            });
        
           
            var newUser = new User({
               firstName: req.body.firstName,
               lastName: req.body.lastName,
               cnic: req.body.cnic,
               email: req.body.email,
               password: req.body.password,
               role:'admin'
           });
          
           // save user
           newUser.save((error, user) => {
               if (error) {
               console.log(error);
               return res.status(404).json({
                  message:'Admin could not be registered'
               })
           }
              /* if(data){
                   return res.status(200).json({
                       user: data
                   })
               }
               */
               
             if(user){
                req.session.save(err => {
                    if(err){
                        console.log(err);
                        console.log('nhi hoowa');
                    } else {
                        console.log(req.session.user)
                        res.send(req.session.user) // YOU WILL GET THE UUID IN A JSON FORMAT
                    }
                });
               //res.json(user);
               return res.status(200).json({
                   user,
                   message:'Admin added'
               });
               }
               
           });
        
    });
}
exports.signin=(req,res)=>{
    User.findOne({email: req.body.email}).exec((error,user)=>{
        if(user){
            if(user.authenticate(req.body.password) && req.user.role === 'admin'){
                //generate token
                const token=jwt.sign({_id:user._id},process.env.JWT_KEY,{expiresIn:'1h'});
                const {_id, firstName, lastName,cnic, email ,gender,role}= user;
                res.status(200).json({
                    token,
                    user:{
                        _id,
                        firstName,
                        lastName,
                        email,
                        cnic,
                        role
                    }
                });
            }
            else{
                return res.status(404).json({
                    message:'Login Failed'
                })
            }
        }
        if(error){
          return res.status(404).json({
              message:'Sign in not possible'
          })
      }
      
    })
}
exports.requireSignin=(req,res,next)=>{

    const token=req.query.authorization.split(" ")[1];
    const user=jwt.verify(token, process.env.JWT_KEY)
    req.user=user;
    next();

}
