const { check , validationResult} = require("express-validator");

exports.validateSignup=[
check('firstName').notEmpty().withMessage("First Name is required"),
check('lastName').notEmpty().withMessage("Last Name is required"),
check('email').isEmail().withMessage("Valid email address required"),
check('password').isLength({min: 6}).withMessage("Password must be atleast 6 characters")
]
exports.isRequestValidated=(req,res,next)=>{
const errors=validationResult(req);
if(errors.array().length>0)
{
    return res.status(400).json({
        error:errors.array()[0].msg
    })
}
next();
}

exports.validateSignin=[
    check('email').isEmail().withMessage("Valid email address required"),
    check('password').isLength({min: 6}).withMessage("Password must be atleast 6 characters")
    ]
