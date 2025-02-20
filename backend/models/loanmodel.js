const { request } = require("express");
const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  userId: {
   type:String,
    ref: "User",
    required: true,
  },
  loanType: {
    type: String,
    enum: ["Personal Loan", "Home Loan", "Business Loan"],
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 1000, // Minimum loan amount
  },
  tenure: {
    type: Number,
    required: true,
    min: 6, // Minimum tenure in months
  },
  interestRate: {
    type: Number,
    required: true,
  },
  emi: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Disbursed","Cancelled"],
    default: "Pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Loan", LoanSchema);
