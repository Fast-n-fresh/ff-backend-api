const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const Category = require("../models/category");
const Product = require("../models/product");
const adminAuth = require("../middleware/adminAuth");
const Feedback = require("../models/feedback");
router.post("/signup", async (req, res) => {
  try {
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await admin.save();
    res.status(201).send({ message: "Admin creted successfully", admin });
  } catch (e) {
    res.status(401).send({ message: "an error occured", e });
  }
});
router.get("/signin", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateAuthToken();
    res.status(200).send({ message: "Signed in successfully ", admin, token });
  } catch (e) {
    res.status(401).send({ message: "Unable to login", e });
  }
});

// create category
router.post("/category", adminAuth, async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      imageUrl: req.body.imageUrl,
    });
    await category.save();
    res.send({ message: "Successfully Created Category!" });
  } catch (e) {
    res.status(400).send({ error: "An error occured", e });
  }
});

// create product
router.post("/product", adminAuth, async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.body.category });
    if (!category) {
      throw "Category Invalid!";
    }
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      metric: req.body.metric,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
      category: category._id,
    });
    category.products.push(product._id);
    await product.save();
    await category.save();
    res.send({ message: "Successfully Created Product!", product });
  } catch (e) {
    res.status(400).send({ error: "An error occured", e });
  }
});

// get feedbacks
router.get("/feedback", adminAuth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    if (!feedbacks) {
      throw "No Feedbacks Yet!";
    }
    res.send({ message: "Successfully sent feedbacks!", feedbacks });
  } catch (e) {
    res.status(404).send({ error: "There was an error! ", e });
  }
});
// admin auth test route
router.get("/test", adminAuth, (req, res) => {
  res.send({ message: "Successfully accessed authenticated route" });
});
module.exports = router;
