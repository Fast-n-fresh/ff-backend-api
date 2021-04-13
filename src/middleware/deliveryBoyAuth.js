const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/deliveryBoy");

const deliveryBoyAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const deliveryBoy = await DeliveryBoy.findOne({
      _id: decoded._id,
    });
    if (!deliveryBoy) {
      throw new Error();
    }
    req.token = token;
    req.deliveryBoy = deliveryBoy;
    next();
  } catch (e) {
    res.status(401).send("Please Authenticate");
  }
};

module.exports = deliveryBoyAuth;
