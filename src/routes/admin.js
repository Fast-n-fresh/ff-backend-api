const express = require("express");
const router = new express.Router();
const Admin = require("../models/admin");
const adminAuth = require("../middleware/adminAuth");
router.post("/signup", async (req, res) => {
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
});
router.get("/signin", async (req, res) => {
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
});
router.get("/test", adminAuth, (req, res) => {
  res.send({ message: "Successfully accessed authenticated route" });
});
module.exports = router;
