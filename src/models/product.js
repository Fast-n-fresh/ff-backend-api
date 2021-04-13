const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  metric: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: "N/A",
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
