const mongoose = require("mongoose");

const loanScheduleSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loan",
    required: true,
  },
  month: Number,
  dueDate: Date,
  amount: Number,
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },
});

const loanschedule=mongoose.model("LoanSchedule", loanScheduleSchema);

module.exports = loanschedule
