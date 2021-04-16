const express = require("express");
const router = new express.Router();
const adminAuth = require("../middleware/adminAuth");
// const Admin = require("../models/admin");
// const Category = require("../models/category");
// const Product = require("../models/product");
// const Feedback = require("../models/feedback");
// const Order = require("../models/order");
// const DeliveryBoy = require("../models/deliveryBoy");
const {
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
} = require("../controller/admin.controller");
router.post("/signup", adminSignUpController);
router.post("/signin", adminSignInController);

// update admin
router.patch("/profile", adminAuth, adminUpdateProfileController);
// delete admin
router.delete("/profile", adminAuth, adminDeleteController);
// craete delivery boy
router.post("/deliveryBoy/signup", adminAuth, deliveryBoySignupController);
// delete a deliveryBoy
router.delete("/deliveryBoy", adminAuth, deliveryBoyDeleteController);
// create category
router.post("/category", adminAuth, createCategoryController);

// create product
router.post("/product", adminAuth, createProductController);

//update product
router.patch("/product/:productId", adminAuth, updateProductController);

//update category
router.patch("/category/:categoryId", adminAuth, updateCategoryController);
router.delete("/category/:categoryId", adminAuth, deleteCategoryController);
router.delete("/product/:productId", adminAuth, deleteProductController);
// get feedbacks
router.get("/feedback", adminAuth, adminGetFeedbackController);

// get pending orders
router.get("/order", adminAuth, getPendingOrderController);

// update order status
/* asigning delivery boy to the order */
router.patch("/order", adminAuth, updateOrderStatusController);

/* Gross delivery status (returns the pending orders of each delivery boy)*/
router.get("/delivery", adminAuth, getGrossDeliveryStatusController);
module.exports = router;
