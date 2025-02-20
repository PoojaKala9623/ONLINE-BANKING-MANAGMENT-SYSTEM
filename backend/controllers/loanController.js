const Account = require("../models/accountModel");
const loanmodel = require("../models/loanmodel");


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
            await account.save();
            await loan.save();

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







module.exports = {
    applyloan,
    loanUpdateStatus,
    getallloans,
    getspecificloan
};