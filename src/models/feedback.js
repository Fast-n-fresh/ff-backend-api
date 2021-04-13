const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryBoy",
    required: false,
  },
  timeStamp: { type: Date, default: Date.now },
});
const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
