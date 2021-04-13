const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const DeliveryBoy = require("../models/deliveryBoy");
const userAuth = require("../middleware/userAuth");
const Feedback = require("../models/feedback");
const Order = require("../models/order");
const Category = require("../models/category");
const Product = require("../models/product");
const deliveryBoyAuth = require("../middleware/deliveryBoyAuth");

// user signup
router.post("/signup", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    });
    await user.save();
    res.status(201).send({ message: "User creted successfully", user });
  } catch (e) {
    res.status(401).send({ message: "an error occured", e });
  }
});

// user signin
router.get("/signin", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ message: "Signed in successfully ", user, token });
  } catch (e) {
    res.status(401).send({ message: "Unable to login", e });
  }
});
// update user
router.patch("/profile", userAuth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "username",
      "email",
      "phoneNumber",
      "address",
    ];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const user = req.user;
    updates.forEach((updateField) => {
      user[updateField] = req.body[updateField];
    });

    await user.save();
    res.send({ message: "User Profile Updated Successfully!" });
  } catch (e) {
    res.status(400).send({ message: "Unable to update", e });
  }
});

// create feedback
router.post("/feedback", userAuth, async (req, res) => {
  try {
    const deliveryBoyName = req.body.deliveryBoyName;
    let searchParams = {
      user: req.user._id,
      message: req.body.message,
      rating: req.body.rating,
    };
    if (deliveryBoyName) {
      const deliveryBoy = await DeliveryBoy.findOne({ name: deliveryBoyName });
      if (!deliveryBoy) {
        throw "Invalid Delivery Boy Name";
      }
      searchParams = { ...searchParams, deliveryBoy: deliveryBoy._id };
    }
    const feedback = new Feedback(searchParams);
    await feedback.save();
    res.send({ message: "Feedback created successfully!" });
  } catch (e) {
    res.status(400).send({ message: "An error occured!", e });
  }
});

// place order
/* triggered after payment is made on the frontend */
router.post("/order", userAuth, async (req, res) => {
  try {
    /*
      req.body.products should be an array of objects 
      where each object should be : {product._id, count}
    */
    const order = new Order({
      products: req.body.products,
      user: req.user._id,
    });
    await order.save();
    req.user.prevOrders.push(order);
    await req.user.save();
    res.send({ message: "order placed successfully" });
  } catch (e) {
    res.status(400).send({ error: "An error occured", e });
  }
});

// get previous orders
router.get("/order", userAuth, async (req, res) => {
  try {
    res.send({ message: "List of previous", prevOrders: req.user.prevOrders });
  } catch (e) {
    res.status(400).send({ error: "An error occured!", e });
  }
});

// read profile
router.get("/profile", userAuth, async (req, res) => {
  try {
    res.send({ message: "User Profile", UserProfile: req.user });
  } catch (e) {
    res.status(400).send({ error: "An error occured!", e });
  }
});

// update delivery status
router.patch("/delivery", userAuth, async (req, res) => {
  try {
    // req._id is the order id
    const order = await Order.findById(req.body._id);
    if (!order) {
      throw "No order found!";
    }
    const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy._id);
    order.status = "Delivered";
    deliveryBoy.pendingOrders = deliveryBoy.pendingOrders.filter(
      (pendingOrder) => pendingOrder._id !== req.body._id
    );
    await deliveryBoy.save();
    await order.save();
    res.send({ message: "delivery status updated successfully!" });
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
});

// get categories
router.get("/category", async (req, res) => {
  try {
    const categoryList = await Category.find({}).select("name imageUrl");
    if (!categoryList) {
      throw "No categories!!";
    }
    res.send({ message: "Category list ", categoryList });
  } catch (e) {
    res.status(400).send({ error: "An error occured", e });
  }
});

// get products in a category
router.get("/category/:category", async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.category });
    if (!category) {
      throw "Invalid Category Name!!";
    }
    const products = await Product.find({ category: category._id });
    if (!products) {
      res.send({ message: "No products in this category yet!" });
      return;
    }
    res.send({ message: "Product list", products });
  } catch (e) {
    res.status(400).send({ error: "An error occured!", e });
  }
});
module.exports = router;
