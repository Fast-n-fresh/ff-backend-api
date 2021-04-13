const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
    required: true,
  },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryBoy",
    required: true,
  },
  timeStamp: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
