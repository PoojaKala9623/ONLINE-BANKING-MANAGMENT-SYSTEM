const mongoose = require("mongoose");

const BillPaymentSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  billerName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  accountNumberbill: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" },
});

module.exports = mongoose.model("BillPayment", BillPaymentSchema);
