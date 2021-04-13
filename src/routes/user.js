const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const DeliveryBoy = require("../models/deliveryBoy");
const userAuth = require("../middleware/userAuth");
const Feedback = require("../models/feedback");

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
// user test
router.get("/test", userAuth, (req, res) => {
  res.send({ message: "Successfully accessed authenticated route" });
});
module.exports = router;
