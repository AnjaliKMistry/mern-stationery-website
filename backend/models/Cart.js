const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
      },
      image: String,
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
