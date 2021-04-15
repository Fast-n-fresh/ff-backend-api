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
router.post("/signin", async (req, res) => {
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

// craete delivery boy
router.post("/deliveryBoy/signup", adminAuth, async (req, res) => {
  try {
    const deliveryBoy = new DeliveryBoy({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
    });
    await deliveryBoy.save();
    res
      .status(201)
      .send({ message: "DeliveryBoy creted successfully", deliveryBoy });
  } catch (e) {
    res.status(401).send({ message: "an error occured", e });
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

//update product
router.patch("/product/:productId", adminAuth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "price",
      "metric",
      "imageUrl",
      "description",
    ];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const product = await Product.findById(req.params.productId);
    updates.forEach((updateField) => {
      product[updateField] = req.body[updateField];
    });
    await product.save();
    res.send({ message: "Product Updated Successfully!" });
  } catch (e) {
    res.status(400).send({ error: "An error occured", e });
  }
});

//update category
router.patch("/category/:categoryId", adminAuth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "imageUrl"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const category = await Category.findById(req.params.categoryId);
    updates.forEach((updateField) => {
      category[updateField] = req.body[updateField];
    });
    await category.save();
    res.send({ message: "Category Updated Successfully!" });
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
  } catch (e) {
    res.status(400).send({ error: "An Error occured!", e });
  }
});

// update order status
/* asigning delivery boy to the order */
router.patch("/order", adminAuth, async (req, res) => {
  try {
    /* pass the order ID and deliveryBoy name in the request Body*/
    const order = await Order.findById(req.body.orderId);
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
    res.send({ message: "Order Assigned to delivery Boy successfully!!" });
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
});

/* Gross delivery status (returns the pending orders of each delivery boy)*/
router.get("/delivery", adminAuth, async (req, res) => {
  try {
    const deliveryBoyList = await DeliveryBoy.find({});
    const deliveryStatus = deliveryBoyList.map((db) => {
      return { deliveryBoy: db.name, pendingOrders: db.pendingOrders };
    });
    res.send({
      message: "List of pending orders per DeliveryBoy",
      deliveryStatus,
    });
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
});
module.exports = router;
