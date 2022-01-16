//import cart schema;
const Cart= require('../models/cart');
const jwt=require('jsonwebtoken');
//too
exports.addItem=async(req,res)=>
{
    const { productId, productQuantity, productPrice, userId} = req.body;
    const quantity=Number.parseInt(productQuantity);
    console.log(quantity);
    //const userId = req.body.userId
    try {
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.Items.findIndex(p => p.productId == productId);
  
        if (itemIndex != -1) {
          
          //product exists in the cart, update the quantity
          let productItem = cart.Items[itemIndex];
          productItem.productQuantity =  productItem.productQuantity + quantity;
          cart.Items[itemIndex] = productItem;
          productItem.Total = productItem.productQuantity  * productItem.productPrice;
          cart.Items[itemIndex] = productItem;
        } 
        else {
          //product does not exists in cart, add new item
          let productItem = cart.Items[itemIndex+1];
          productItem.Total = productItem.productQuantity  * productItem.productPrice;
          cart.Items[itemIndex] = productItem;
          cart.Items.push({ productId, productQuantity, productPrice});
        }
        cart = await cart.save();
        console.log(cart);
        return res.status(200).json({
            cart
        })
      } else {
        //no cart for user, create new cart
        const newCart = await Cart.create({
          userId,
          products: [{ productId, productQuantity, productPrice }]
        });
        console.log(newCart);
  
        return res.status(200).json({
            newCart
        })
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        //send("Something went wrong");
        message:"Something went wrong"
      })
      
    }

}

exports.getCart=(req,res)=>{
  Cart.findOne({ userId: req.body.userId }).exec((error, user) => {
    if (error) {
      res.status(400).json({
        message: "Cart not found",
      });
    }
    if (user) {
      return res.status(200).json({
        user,
      });
    }
  });

}


// exports.addItem =(req,res)=>{
//     User.findOne({ user: req.body._id }).exec((err, user) => {
//         if(err)
//         {
//             throw(err);
//         }
//         //agar cart pehle hi bani h h toh sirf prduct update karna h 
//         if (user) {
//             //agar toh cart mil gayi purani wali toh bas item usmein push kardo 
//             // cart:
//             // [{
//             //     item1,
//             //     item2
//             //  }
//             // ]

//             Cart.findOneAndUpdate({user:req.user_id},{
//                 "$push":{
//                     "Items":req.body.Items
//                 }
//             }).exec((err, user) => {
//                 if(err)
//                 {
//                     throw(err);
//                 }
//                 if(user)
//                 {
//                     res.status(200).json({
//                         message:"Item Added to the cart"
//                     })
//                 }
//                 else
//                 {
//                     res.status(200).json({
//                         message:"Item could not be added"
//                     })
//                 }
//             })
           
//         }
//         else
//         {
//             const cartObj= new Cart({
//                 userId: req.body.userId,
//                 Items: [req.body.Items]
//             })
            
//             cartObj.save((err, data) => {
//                 if (err) {
//                   return res.status(400).json({
//                     message: "Cart nhi bani",
//                   });
//                 } else {
//                   return res.status(200).json({
//                     message: "Cart bangayi",
//                     data,
//                   });
//                 }
//               });
            
//             res.status(200).json({
//                 message:"Item Added"
//             })

//         }
//     });

// }