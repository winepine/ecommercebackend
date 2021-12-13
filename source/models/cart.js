const mongoose = require('mongoose');
const Cart= new mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    Items:[
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required: true
            },
            productQuantity:{
               type: Number,
               required: true
            },
            productPrice:{
                type: Number,
                required: true
            }
        }
    ]

}, {timestamps: true});



module.exports=mongoose.model('Cart', Cart);

