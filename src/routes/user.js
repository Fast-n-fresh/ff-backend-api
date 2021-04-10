const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const userAuth = require("../middleware/userAuth");
router.post("/signup", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    });
    await user.save();
    res.status(201).send({ message: "User creted successfully", user });
  } catch (e) {
    res.status(401).send({ message: "an error occured", e });
  }
});
router.get("/signin", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ message: "Signed in successfully ", user, token });
  } catch (e) {
    res.status(401).send({ message: "Unable to login", e });
  }
});
router.get("/test", userAuth, (req, res) => {
  res.send({ message: "Successfully accessed authenticated route" });
});
module.exports = router;
