const string = require("joi/lib/types/string");
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      requitred: true,
      trim: true,
    },
    //multiple images with type
    // image ka url store hoga
    image: [{ img: { type: String } }],
    //customer can add review toh yahan link hoga
    //foreign key wala concept to see kis ne review add kiya
    review: [
      {
        //user:
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        //review:
        userreview: String,
      },
    ],
    creator: {
      //  admin id:
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    category: {
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
