const express = require("express");
const router = new express.Router();
const DeliveryBoy = require("../models/deliveryBoy");
const deliveryBoyAuth = require("../middleware/deliveryBoyAuth");
const Order = require("../models/order");

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
// update admin
router.patch("/profile", deliveryBoyAuth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "phoneNumber"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    const deliveryBoy = req.deliveryBoy;
    updates.forEach((updateField) => {
      deliveryBoy[updateField] = req.body[updateField];
    });
    await deliveryBoy.save();
    res.send({ message: "DeliveryBoy Profile Updated Successfully!" });
  } catch (e) {
    res.status(400).send({ message: "Unable to update", e });
  }
});
//get assigned orders
router.get("/order", deliveryBoyAuth, async (req, res) => {
  try {
    res.send({
      message: "Assigned Orders",
      orders: req.deliveryBoy.pendingOrders,
    });
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
});

// update delivery status
router.patch("/delivery", deliveryBoyAuth, async (req, res) => {
  try {
    // req._id is the order id
    const order = await Order.findById(req.body.orderId);
    if (!order) {
      throw "No order found!";
    }
    order.status = "Delivered";
    req.deliveryBoy.pendingOrders = req.deliveryBoy.pendingOrders.filter(
      (pendingOrder) => req.body.orderId !== String(pendingOrder._id)
    );
    await req.deliveryBoy.save();
    await order.save();
    res.send({ message: "delivery status updated successfully!" });
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
});

// deliveryBoy profile
router.get("/profile", deliveryBoyAuth, (req, res) => {
  try {
    res.send({ message: "Delivery Boy Profile", deliveryBoy: req.deliveryBoy });
  } catch (e) {
    res.status(404).send({ error: "an error occured!", e });
  }
});
module.exports = router;
