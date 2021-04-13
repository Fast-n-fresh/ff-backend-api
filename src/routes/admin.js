const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const Category = require("../models/category");
const Product = require("../models/product");
const adminAuth = require("../middleware/adminAuth");
const Feedback = require("../models/feedback");
const Order = require("../models/order");
const DeliveryBoy = require("../models/deliveryBoy");
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
// update admin
router.patch("/profile", adminAuth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const admin = req.admin;
    updates.forEach((updateField) => {
      admin[updateField] = req.body[updateField];
    });
    await admin.save();
    res.send({ message: "Admin Profile Updated Successfully!" });
  } catch (e) {
    res.status(400).send({ message: "Unable to update", e });
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

// get pending orders
router.get("/order", adminAuth, async (req, res) => {
  try {
    const pendingOrders = await Order.find({ status: "Pending" });
    if (!pendingOrders) {
      res.send({ message: "No pending orders!" });
      return;
    }
    res.send({ message: "List of pending orders", pendingOrders });
  } catch (e) {}
});

// update order status
/* asigning delivery boy to the order */
router.patch("/order", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req._id);
    if (!order) {
      throw "No Order Exists!";
    }
    const deliveryBoy = await DeliveryBoy.findOne({
      name: req.body.deliveryBoyName,
    });
    if (!deliveryBoy) {
      throw "Invalid Delvery Boy Name!";
    }
    deliveryBoy.pendingOrders.push(order._id);
    order.deliveryBoy = deliveryBoy._id;
    order.status = "Placed";
    await deliveryBoy.save();
    await order.save();
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
});

//TODO : GetGrossDelvieryStatus
module.exports = router;
