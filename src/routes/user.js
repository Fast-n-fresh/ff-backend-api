const express = require("express");
const router = new express.Router();
const userAuth = require("../middleware/userAuth");

const {
  userSignUpController,
  userSignInController,
  updateUserController,
  deleteUserController,
  createFeedbackController,
  placeOrderController,
  previousOrdersController,
  userReadProfileController,
  updateDelvieryStatusController,
  getCategoriesController,
  getProductsByCategoryController,
} = require("../controller/user.controller");

// user signup
router.post("/signup", userSignUpController);

// user signin
router.post("/signin", userSignInController);

// update user
router.patch("/profile", userAuth, updateUserController);

//delete user
router.delete("/", userAuth, deleteUserController);
// create feedback
router.post("/feedback", userAuth, createFeedbackController);

// place order
/* triggered after payment is made on the frontend */
router.post("/order", userAuth, placeOrderController);

// get previous orders
router.get("/order", userAuth, previousOrdersController);

// read profile
router.get("/profile", userAuth, userReadProfileController);

// update delivery status
router.patch("/delivery", userAuth, updateDelvieryStatusController);

// get categories
router.get("/category", getCategoriesController);

// get products in a category
router.get("/category/:category", getProductsByCategoryController);

module.exports = router;
