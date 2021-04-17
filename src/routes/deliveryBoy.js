const express = require("express");
const router = new express.Router();
const deliveryBoyAuth = require("../middleware/deliveryBoyAuth");
const {
  deliveryBoySignInController,
  deliveryBoyProfileUpdateController,
  deliveryBoyAssignedOrdersController,
  updateDeliveryStatusController,
  deliveryBoyProfileController,
} = require("../controller/deliveryBoy.controller");

//deliveryBoy signin
router.post("/signin", deliveryBoySignInController);

// update deliveryBoy
router.patch("/profile", deliveryBoyAuth, deliveryBoyProfileUpdateController);

//get assigned orders
router.get("/order", deliveryBoyAuth, deliveryBoyAssignedOrdersController);

// update delivery status
router.patch("/delivery", deliveryBoyAuth, updateDeliveryStatusController);

// deliveryBoy profile
router.get("/profile", deliveryBoyAuth, deliveryBoyProfileController);

module.exports = router;
