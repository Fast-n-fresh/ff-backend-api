//import mongoose and validator modules
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

//import bcryptjs for hashing the password

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
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
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  prevOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

//return public data of the user (object/instance)
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
//(instance) method accessable by our individual object(user) of Model(User)
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);
  return token;
};

//static method accessible by our Model(User)
userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    return user;
  } catch (e) {
    // console.log(e);
  }
};

//hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  //if user has modified the password
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next(); //signifies end ofthe middle process just before save is executed
});
const User = mongoose.model("User", userSchema);
module.exports = User;
