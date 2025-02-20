const Account = require("../models/accountModel");
const billpayments = require("../models/billpayments");


const paybill  =  async (req, res) => {
    try {
      const { billerName, accountNumber, amount,accountNumberbill } = req.body;
      const payment = new billpayments({
        userId: req.body.id,
        billerName,
        accountNumber,
        amount,
        status: "Success",
        accountNumberbill
      });


   const account = await Account.findOne({ client_id: accountNumber });

if (!account) {
    return res.status(404).json({ error: "Account not found" });
}

if (account.balance < amount) {
    return res.status(400).json({ error: "Insufficient balance" });
}

// Deduct the amount
account.balance -= amount;

// Save the updated account
await account.save();




      await payment.save();
      res.status(201).json({ message: "Bill paid successfully", payment });
    } catch (error) {
        console.log(error);
        
      res.status(500).json({ error: "Failed to process payment" });
    }
  }


  module.exports = {
    paybill,
  };