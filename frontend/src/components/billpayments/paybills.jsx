import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const BillPayment = () => {

     const {
        account,
        isError,
        isLoading: isUserAccountLoading,
        message,
      } = useSelector((state) => state.userAccount);
    

      console.log(account);
      

  const [billerName, setBillerName] = useState("");
  const [accountNumberbill, setAccountNumberbill] = useState("");
  const [amount, setAmount] = useState("");

  // Billers with input field types
  const billers = [
    { name: "EB Bill", label: "EB Account Number" },
    { name: "Phone Bill", label: "Phone Number" },
    { name: "Recharge", label: "Phone Number" },
  ];

  // Get the dynamic label based on selected biller
  const selectedBiller = billers.find((b) => b.name === billerName);
  const accountLabel = selectedBiller ? selectedBiller.label : "Account Number";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/bill/pay", {
        id:account.client_id,
        billerName,
        accountNumber:account.client_id,
        amount,
        accountNumberbill
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log(response.data);
      

      alert(response.data.message);
      setBillerName("");
      setAccountNumberbill("");
      setAmount("");
    } catch (error) {
      console.error("Payment failed:", error.response?.data?.error || error.message);
      alert(error.response?.data?.error || "Payment failed!");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Bill Payment</Typography>
      
      {/* Biller Selection Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Biller Name</InputLabel>
        <Select value={billerName} onChange={(e) => setBillerName(e.target.value)} required>
          {billers.map((biller, index) => (
            <MenuItem key={index} value={biller.name}>{biller.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dynamic Account Number / Phone Number Field */}
      <TextField
        fullWidth
        label={accountLabel}
        variant="outlined"
        margin="normal"
        type={billerName === "EB Bill" ? "text" : "tel"} // EB Bill takes text, others take phone number
        value={accountNumberbill}
        onChange={(e) => setAccountNumberbill(e.target.value)}
        required
      />

      {/* Amount Field */}
      <TextField
        fullWidth
        label="Amount"
        variant="outlined"
        margin="normal"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {/* Submit Button */}
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        Pay Now
      </Button>
    </Box>
  );
};

export default BillPayment;
