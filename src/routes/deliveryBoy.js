const express = require("express");
const router = new express.Router();
const DeliveryBoy = require("../models/deliveryBoy");
const deliveryBoyAuth = require("../middleware/deliveryBoyAuth");
router.post("/signup", async (req, res) => {
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
router.get("/signin", async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await deliveryBoy.generateAuthToken();
    res
      .status(200)
      .send({ message: "Signed in successfully ", deliveryBoy, token });
  } catch (e) {
    res.status(401).send({ message: "Unable to login", e });
  }
});
router.get("/test", deliveryBoyAuth, (req, res) => {
  res.send({ message: "Successfully accessed authenticated route" });
});
module.exports = router;
