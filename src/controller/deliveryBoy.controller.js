const DeliveryBoy = require("../models/deliveryBoy");
const Order = require("../models/order");
const Product = require("../models/product");

const deliveryBoySignInController = async (req, res) => {
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
};
const deliveryBoyProfileUpdateController = async (req, res) => {
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
};

const deliveryBoyAssignedOrdersController = async (req, res) => {
  try {
    const pendingOrderID = req.deliveryBoy.pendingOrders;
    let pendingOrders = [];
    for (let i of pendingOrderID) {
      const pendingOrder = await Order.findById(i);
      for (let j in pendingOrder["products"]) {
        const product = await Product.findById(
          pendingOrder["products"][j]["product"]
        );
        pendingOrder["products"][j]["product"] = product;
      }
      pendingOrders.push(pendingOrder);
    }
    res.send({
      message: "Assigned Orders",
      orders: pendingOrders,
    });
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
};
const updateDeliveryStatusController = async (req, res) => {
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
};

const deliveryBoyProfileController = (req, res) => {
  try {
    res.send({ message: "Delivery Boy Profile", deliveryBoy: req.deliveryBoy });
  } catch (e) {
    res.status(404).send({ error: "an error occured!", e });
  }
};
module.exports = {
  deliveryBoySignInController,
  deliveryBoyProfileUpdateController,
  deliveryBoyAssignedOrdersController,
  updateDeliveryStatusController,
  deliveryBoyProfileController,
};
