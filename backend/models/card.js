const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    user_id: {
      type:String,
      ref: "User",
      required: [true, "User ID is required"],
    },
    card_number: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{16}$/, "Card number must be 16 digits"],
    },
    card_type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    transaction_limit: {
      type: Number,
      default: 10000,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    rewards_points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended","pending"],
      default: "pending",
    },
    statements: [
      {
        date: Date,
        amount: Number,
        type: {
          type: String,
          enum: ["debit", "credit"],
        },
        description: String,
      },
    ],
  },
  { timestamps: true, collection: "Cards" }
);

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
