const dayjs = require("dayjs");
const Account = require("../models/accountModel");
const loanmodel = require("../models/loanmodel");
const loanschedule = require("../models/LoanSchedule");


const applyloan = async (req, res) => {


    const { loanType, loanAmount, tenure, interestRate, emi, userId } = req.body;
    console.log(req.body);
    

    // Validate input
    if (!loanType || !loanAmount || !tenure || !interestRate || !emi || !userId) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new loan application
    try {
        const loanApplication = new loanmodel({
            userId,
            loanType,
            loanAmount,
            tenure,
            interestRate,
            emi,
            status: "Pending", // Default status
        });

        // Save to database
        await loanApplication.save();
        console.log(`Loan Application: ${loanType} of ₹${loanAmount} for ${tenure} months at ${interestRate}%`);

        // Respond with success message
        res.json({ message: "Loan application submitted successfully!" });
    } catch (error) {
        console.error("Error saving loan application:", error);
        res.status(500).json({ error: "Failed to submit loan application" });
    }
}

// Update Loan Status: Approve, Reject, Cancel

const loanUpdateStatus = async (req, res) => {
    const { loanId } = req.params;
    const { status } = req.body; // Action: "approve", "reject", "cancel"
    console.log(req.body);
   const action=status

    try {
        // Find the loan application
        const loan = await loanmodel.findById(loanId);
        if (!loan) {
            return res.status(404).json({ error: "Loan application not found" });
        }

        // Prevent modifying loans that are already approved or rejected
        if (loan.status === "Approved" || loan.status === "Rejected") {
            return res.status(400).json({ error: `Loan is already ${loan.status}` });
        }

        // Handle different actions
        if (action === "Approved") {
            // Find the user's account
            const account = await Account.findOne({ client_id: loan.userId });
            if (!account) {
                return res.status(404).json({ error: "User account not found" });
            }

            // Credit loan amount to user's account balance
            account.balance += loan.loanAmount;
            loan.status = "Approved";

            // Save changes

            account.in.push({
                to: "Loan sanctioned",
                balance_transfered: loan.loanAmount,
              });

            await account.save();
            await loan.save();

            const schedule = Array.from({ length: loan.tenure }, (_, i) => ({
                loanId: loan._id,
                month: i + 1,
                dueDate: dayjs(loan.appliedAt).add(i, "month").toDate(),
                amount: loan.emi,
              }));

           
          
              await loanschedule.insertMany(schedule);

            return res.json({ message: "Loan approved and amount credited successfully!" });

            // "Pending", "Approved", "Rejected", "Disbursed","Cancelled"

        } else if (action === "Rejected") {
            loan.status = "Rejected";
            await loan.save();
            return res.json({ message: "Loan rejected successfully!" });

        } else if (action === "Cancelled") {
            loan.status = "Cancelled";
            await loan.save();
            return res.json({ message: "Loan application cancelled successfully!" });

        } else {
            return res.status(400).json({ error: "Invalid action. Use 'approve', 'reject', or 'cancel'." });
        }
    } catch (error) {
        console.error("Error updating loan status:", error);
        res.status(500).json({ error: "Failed to update loan status" });
    }
}


const getallloans = async (req, res) => {

    try {
        const loans = await loanmodel.find();
        res.json(loans);
    } catch (error) {
        console.error("Error fetching loans:", error);
        res.status(500).json({ error: "Failed to fetch loans" });
    }

}

const getspecificloan = async (req, res) => {
    const { loanId } = req.params;

    console.log(loanId);
    

    try {
        const loan = await loanmodel.find({userId:loanId});
        console.log(loan);
        
         if (!loan) {
                return res.status(404).json({ error: "Loan not found" });
            }
             res.json(loan);
    } catch (error) {
        console.error("Error fetching loan:", error); res.status(500).json({ error: "Failed to fetch loan" });
    }
}

const getloanStatement = async (req, res) => {
    const { loanId } = req.params;

    try {
        const loan = await loanschedule.find({userId:loanId});
        console.log(loan);
        
         if (!loan) {
                return res.status(404).json({ error: "Loan not found" });
            }
         
         
       const statement=  await loanschedule.find({loanId:loanId});

       res.json(statement);

    } catch (error) {
        console.error("Error fetching loan:", error); res.status(500).json({ error: "Failed to fetch loan" });
    }
}

const payemi = async (req, res) => {
    try {
      const { emiid } = req.params;
      const { status } = req.body;
  
      if (status !== "Paid") {
        return res.status(400).json({ message: "Invalid payment status." });
      }
  
      // 1. Get EMI/Loan Schedule
      const emi = await loanschedule.findById(emiid);
      if (!emi) {
        return res.status(404).json({ message: "EMI not found." });
      }
  
      if (emi.status === "Paid") {
        return res.status(400).json({ message: "This EMI is already paid." });
      }
  
      // 2. Get Loan to fetch userId and EMI amount
      const loan = await loanmodel.findById(emi.loanId); // Assuming loanId exists on EMI
      if (!loan) {
        return res.status(404).json({ message: "Loan not found." });
      }
  
      // 3. Get user's account by userId
      const account = await Account.findOne({ client_id: loan.userId });
      if (!account) {
        return res.status(404).json({ message: "Account not found." });
      }
  
      // 4. Check if balance is enough
      if (account.balance < emi.amount) {
        return res.status(400).json({ message: "Insufficient balance in account." });
      }
  
      // 5. Deduct EMI amount from account balance
      account.balance -= emi.amount;
  
      // 6. Log the transfer in account (outgoing)
      account.out.push({
        to: "Loan Payment",
        balance_transfered: emi.amount,
      });
  
      // 7. Save updated account
      await account.save();
  
      // 8. Update EMI status to Paid
      await loanschedule.findByIdAndUpdate(emiid, {
        status: "Paid",
      });
  
      return res.status(200).json({ message: "EMI paid successfully." });
    } catch (error) {
      console.error("Payment failed:", error);
      return res.status(500).json({ message: "Server error while paying EMI." });
    }
  };


  const getTransactionHistory = async (req, res) => {
    const { clientId } = req.params;
  
    try {
      const account = await Account.findOne({ client_id: clientId });
  
      if (!account) {
        return res.status(404).json({ message: "Account not found for this Client ID" });
      }
  
      const inTransactions = account.in.map(txn => ({
        type: "IN",
        from: txn.from,
        amount: txn.balance_transfered,
        date: txn.createdAt,
      }));
  
      const outTransactions = account.out.map(txn => ({
        type: "OUT",
        to: txn.to,
        amount: txn.balance_transfered,
        date: txn.createdAt,
      }));
  
      const allTransactions = [...inTransactions, ...outTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
  
      res.status(200).json({ transactions: allTransactions });
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };








module.exports = {
    applyloan,
    loanUpdateStatus,
    getallloans,
    getspecificloan,
    getloanStatement,
    payemi,
    getTransactionHistory
};