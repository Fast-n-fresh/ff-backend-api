const mongoose = require("mongoose");
const Product = require("./product");
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});
categorySchema.pre("remove", async function (req, res, next) {
  const category = this;
  await Product.deleteMany({ category: category._id });
  next();
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
