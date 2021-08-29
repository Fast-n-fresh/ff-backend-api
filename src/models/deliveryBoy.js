//import mongoose and validator modules
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
  },
  pendingOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

//return public data of the admin (object/instance)
deliveryBoySchema.methods.toJSON = function () {
  const deliveryBoy = this;
  const deliveryBoyObject = deliveryBoy.toObject();
  delete deliveryBoyObject.password;
  return deliveryBoyObject;
};
//(instance) method accessable by our individual object(user) of Model(User)
deliveryBoySchema.methods.generateAuthToken = async function () {
  const deliveryBoy = this;
  try {
    const token = jwt.sign(
      { _id: deliveryBoy.id.toString() },
      process.env.JWT_SECRET
    );
    return token;
  } catch (e) {
    // console.log(e);
  }
};

//static method accessible by our Model(User)
deliveryBoySchema.statics.findByCredentials = async (email, password) => {
  const deliveryBoy = await DeliveryBoy.findOne({ email });
  if (!deliveryBoy) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, deliveryBoy.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return deliveryBoy;
};

//hash the plain text password before saving
deliveryBoySchema.pre("save", async function (next) {
  const deliveryBoy = this;

  //if deliveryBoy has modified the password
  if (deliveryBoy.isModified("password")) {
    deliveryBoy.password = await bcrypt.hash(deliveryBoy.password, 8);
  }
  next(); //signifies end ofthe middle process just before save is executed
});
const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);
module.exports = DeliveryBoy;
