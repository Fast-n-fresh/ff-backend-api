const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const Category = require("../models/category");
const Product = require("../models/product");
const adminAuth = require("../middleware/adminAuth");
const Feedback = require("../models/feedback");
const Order = require("../models/order");
const DeliveryBoy = require("../models/deliveryBoy");
const adminSignUpController = async (req, res) => {
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
};
const adminSignInController = async (req, res) => {
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
};

const adminUpdateProfileController = async (req, res) => {
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
};
const adminDeleteController = async (req, res) => {
  try {
    req.admin.delete();
    res.send({ message: "Admin deleted successfully!!" });
  } catch (e) {
    res.status(400).send({ message: "Unable to update", e });
  }
};
const deliveryBoySignupController = async (req, res) => {
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
};

const deliveryBoyDeleteController = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findOne({ email: req.body.email });
    // change the status of all the assingned orders to pending
    deliveryBoy.pendingOrders.forEach(async (pendingOrder) => {
      const order = await Order.findById(pendingOrder);
      order.deliveryBoy = undefined;
      order.status = "Pending";
      await order.save();
    });
    await deliveryBoy.remove();
    res.send({ message: "Delivery Boy Deleted Successfully" });
    res.send();
  } catch (e) {
    res.status(401).send({ message: "an error occured", e });
  }
};
const createCategoryController = async (req, res) => {
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
};
const createProductController = async (req, res) => {
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
};
const updateCategoryController = async (req, res) => {
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
};
const updateProductController = async (req, res) => {
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
};
const deleteCategoryController = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      throw "Invalid Category ID provided";
    }
    const categoryDeleteObj = await category.remove();
    res.send({
      message: "Category deleted successfully !!",
      categoryDeleteObj,
    });
  } catch (e) {
    res.status(400).send({ error: "An error occured", e });
  }
};
const deleteProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      throw "Invalid Product ID provided";
    }
    const category = await Category.findById(product.category);
    category.products = category.products.filter(
      (prod) => String(prod) !== req.params.productId
    );
    await category.save();
    const productDeleteObj = await product.remove();
    res.send({
      message: "Product deleted successfully !!",
      productDeleteObj,
    });
  } catch (e) {
    res.status(400).send({ error: "An error occured", e });
  }
};

const adminGetFeedbackController = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({});
    if (!feedbacks) {
      throw "No Feedbacks Yet!";
    }
    /* 
        if the feedbacks do not contain 
          1) Delivery Boy : The Delivery Boy Has been Deleted or The user never mentioned him/her
          2) User : The user is deleted 
      */
    res.send({ message: "Successfully sent feedbacks!", feedbacks });
  } catch (e) {
    res.status(404).send({ error: "There was an error! ", e });
  }
};
const getPendingOrderController = async (req, res) => {
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
};

const updateOrderStatusController = async (req, res) => {
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
};

const getGrossDeliveryStatusController = async (req, res) => {
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
};
const getAllDeliveryBoysController = async (req, res) => {
  try {
    const deliveryBoyList = await DeliveryBoy.find({});
    res.send({
      message: "List of DeliveryBoys",
      deliveryBoyList,
    });
  } catch (e) {
    res.status(404).send({ error: "An error occured!", e });
  }
};
const adminProfileController = (req, res) => {
  try {
    res.send({ message: "Admin Profile", admin: req.admin });
  } catch (e) {
    res.status(404).send({ error: "an error occured!", e });
  }
};
module.exports = {
  getGrossDeliveryStatusController,
  adminSignUpController,
  updateOrderStatusController,
  getPendingOrderController,
  adminGetFeedbackController,
  deleteProductController,
  createCategoryController,
  createProductController,
  updateCategoryController,
  updateProductController,
  deleteCategoryController,
  adminSignInController,
  adminUpdateProfileController,
  adminDeleteController,
  deliveryBoySignupController,
  deliveryBoyDeleteController,
  getAllDeliveryBoysController,
  adminProfileController,
};
