//import cart schema;
const Cart= require('../models/cart');

exports.addItem=(req,res)=>
{
    const { productId, productQuantity, productPrice } = req.body;
  
    const userId = req.body.userId; 
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.productId == productId);
  
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          cart.products[itemIndex] = productItem;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({ productId, quantity, name, price });
        }
        cart = await cart.save();
        return res.status(201).send(cart);
      } else {
        //no cart for user, create new cart
        const newCart = await Cart.create({
          userId,
          products: [{ productId, quantity, name, price }]
        });
  
        return res.status(201).send(newCart);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  });

exports.addItem=(req,res)=>{
    User.findOne({ user: req.body._id }).exec((err, user) => {
        if(err)
        {
            throw(err);
        }
        //agar cart pehle hi bani h h toh sirf prduct update karna h 
        if (user) {
            //agar toh cart mil gayi purani wali toh bas item usmein push kardo 
            // cart:
            // [{
            //     item1,
            //     item2
            //  }
            // ]

            Cart.findOneAndUpdate({user:req.user_id},{
                "$push":{
                    "Items":req.body.Items
                }
            }).exec((err, user) => {
                if(err)
                {
                    throw(err);
                }
                if(user)
                {
                    res.status(200).json({
                        message:"Item Added to the cart"
                    })
                }
                else
                {
                    res.status(200).json({
                        message:"Item could not be added"
                    })
                }
            })
           
        }
        else
        {
            const cartObj= new Cart({
                userId: req.body.userId,
                Items: [req.body.Items]
            })
            
            cartObj.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    message: "Cart nhi bani",
                  });
                } else {
                  return res.status(200).json({
                    message: "Cart bangayi",
                    data,
                  });
                }
              });
            
            res.status(200).json({
                message:"Item Added"
            })

        }
    });

}