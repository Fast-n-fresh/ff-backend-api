//import mongoose and validator modules
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

//import bcryptjs for hashing the password

const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
});

//return public data of the admin (object/instance)
adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  return adminObject;
};
//(instance) method accessable by our individual object(user) of Model(User)
adminSchema.methods.generateAuthToken = async function () {
  const admin = this;
  try {
    const token = jwt.sign(
      { _id: admin.id.toString() },
      process.env.JWT_SECRET
    );
    return token;
  } catch (e) {
    console.log(e);
  }
};

//static method accessible by our Model(User)
adminSchema.statics.findByCredentials = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new Error("Unable to login");
    }
    return admin;
  } catch (e) {
    console.log(e);
  }
};

//hash the plain text password before saving
adminSchema.pre("save", async function (next) {
  const admin = this;

  //if admin has modified the password
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next(); //signifies end ofthe middle process just before save is executed
});
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
