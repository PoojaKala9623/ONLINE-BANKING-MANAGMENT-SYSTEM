import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from "@mui/material";
import { url } from "../../config/config";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";

const LoanApplication = () => {
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState(""); // Loan tenure in months
  const [interestRate, setInterestRate] = useState(""); // Interest rate percentage
  const [emi, setEmi] = useState(null);

  const {
    account,
    isError,
    isLoading: isUserAccountLoading,
    message,
  } = useSelector((state) => state.userAccount);

  console.log(account);

  // Loan Types
  const loanTypes = [
    { name: "Personal Loan", rate: 12 },
    { name: "Home Loan", rate: 8 },
    { name: "Business Loan", rate: 10 },
  ];

  // Handle loan type selection
  const handleLoanTypeChange = (event) => {
    const selectedLoan = loanTypes.find((loan) => loan.name === event.target.value);
    setLoanType(selectedLoan.name);
    setInterestRate(selectedLoan.rate);
  };

  // EMI Calculation
  const calculateEMI = () => {
    if (!loanAmount || !tenure || !interestRate) return;

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseInt(tenure);

    const emiAmount = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    setEmi(emiAmount.toFixed(2));
  };

  // Handle Loan Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "api/loans/apply", {
        userId: account.client_id,
        loanType,
        loanAmount,
        tenure,
        interestRate,
        emi,
      });

      alert(response.data.message);
      setLoanType("");
      setLoanAmount("");
      setTenure("");
      setInterestRate("");
      setEmi(null);
    } catch (error) {
      console.error("Loan application failed:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || "Loan application failed!");
    }
  };

  // Generate Interest Statement PDF
  const generatePDF = () => {
    if (!emi || !loanAmount || !tenure || !interestRate || !loanType) {
      alert("Please fill the form and calculate EMI first.");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Loan Interest Statement", 70, 15);

    // Loan Info
    doc.setFontSize(12);
    doc.text(`Loan Type: ${loanType}`, 14, 30);
    doc.text(`Loan Amount: ₹${loanAmount}`, 14, 38);
    doc.text(`Interest Rate: ${interestRate}%`, 14, 46);
    doc.text(`Tenure: ${tenure} months`, 14, 54);
    doc.text(`Monthly EMI: ₹${emi}`, 14, 62);

    // Table Heading
    let startY = 75;
    doc.setFont(undefined, 'bold');
    doc.text("Month", 14, startY);
    doc.text("EMI Amount (₹)", 60, startY);
    doc.setFont(undefined, 'normal');

    // Monthly Payment Rows
    let y = startY + 8;
    for (let i = 1; i <= tenure; i++) {
      doc.text(`${i}`, 14, y);
      doc.text(`₹${emi}`, 60, y);
      y += 8;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save("Loan_Interest_Statement.pdf");
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Apply for a Loan</Typography>

      {/* Loan Type Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Loan Type</InputLabel>
        <Select value={loanType} onChange={handleLoanTypeChange} required>
          {loanTypes.map((loan, index) => (
            <MenuItem key={index} value={loan.name}>{loan.name} (Rate: {loan.rate}%)</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Loan Amount */}
      <TextField
        fullWidth
        label="Loan Amount"
        variant="outlined"
        margin="normal"
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(e.target.value)}
        required
      />

      {/* Tenure (Months) */}
      <TextField
        fullWidth
        label="Tenure (Months)"
        variant="outlined"
        margin="normal"
        type="number"
        value={tenure}
        onChange={(e) => setTenure(e.target.value)}
        required
      />

      {/* Interest Rate (Read-only) */}
      <TextField
        fullWidth
        label="Interest Rate (%)"
        variant="outlined"
        margin="normal"
        value={interestRate}
        disabled
      />

      {/* Calculate EMI Button */}
      <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={calculateEMI}>
        Calculate EMI
      </Button>

      {/* Show EMI Result */}
      {emi && (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Estimated EMI: ₹{emi}/month
        </Typography>
      )}

      {/* Download PDF Button */}
      <Button variant="outlined" color="success" fullWidth sx={{ mt: 2 }} onClick={generatePDF}>
        Download Interest Statement
      </Button>

      {/* Submit Button */}
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Apply Now
      </Button>
    </Box>
  );
};

export default LoanApplication;
