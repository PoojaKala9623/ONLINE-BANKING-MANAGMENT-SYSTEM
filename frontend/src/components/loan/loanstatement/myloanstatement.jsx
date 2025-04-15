import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Box,
} from "@mui/material";

const MyStatementLoanDetails = ({ loanId }) => {
  const [emiList, setEmiList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmi, setSelectedEmi] = useState(null);
  const [paymentType, setPaymentType] = useState("card");
  const [cardDetails, setCardDetails] = useState({ number: "", cvv: "", expiry: "" });

  useEffect(() => {
    const fetchEmis = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/loans/loanstatement/${loanId}`);
        setEmiList(res.data);
      } catch (err) {
        console.error("Error fetching EMI schedule", err);
      }
    };
    fetchEmis();
  }, [loanId]);

  const handlePayClick = (emi) => {
    setSelectedEmi(emi);
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleConfirmPayment = async () => {
    if (paymentType === "card") {
      const { number, cvv, expiry } = cardDetails;
      const valid =
        /^\d{16}$/.test(number) &&
        /^\d{3}$/.test(cvv) &&
        /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);

      if (!valid) {
        alert("Please enter valid card details");
        return;
      }
    }

    try {
      // Example: update payment status (you can change the endpoint as needed)
      await axios.put(`http://localhost:5000/api/loans/payemi/${selectedEmi._id}`, {
        status: "Paid",
      });

      // Refresh EMI list
      const res = await axios.get(`http://localhost:5000/api/loans/loanstatement/${loanId}`);
      setEmiList(res.data);

      alert("Payment successful!");
      setOpenModal(false);
      setCardDetails({ number: "", cvv: "", expiry: "" });
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed.");
    }
  };

  return (
    <div className="p-4 shadow-md rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Loan EMI Schedule</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border border-gray-200">Month</th>
              <th className="p-2 border border-gray-200">Due Date</th>
              <th className="p-2 border border-gray-200">EMI Amount</th>
              <th className="p-2 border border-gray-200">Status</th>
              <th className="p-2 border border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {emiList.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="p-2 border text-center border-gray-200">{item.month}</td>
                <td className="p-2 border border-gray-200">
                  {dayjs(item.dueDate).format("DD MMM YYYY")}
                </td>
                <td className="p-2 border border-gray-200">₹ {item.amount.toFixed(2)}</td>
                <td className="p-2 border border-gray-200">
                  <span
                    className={`text-${
                      item.status === "Pending" ? "orange-500" : "green-600"
                    } font-medium`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-2 border border-gray-200 text-center">
                  <button
                    disabled={item.status === "Paid"}
                    onClick={() => handlePayClick(item)}
                    className={`px-4 py-1 text-white rounded ${
                      item.status === "Pending"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400"
                    }`}
                  >
                    {item.status === "Pending" ? "PAY" : "PAID"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Choose Payment Method</DialogTitle>
        <DialogContent>
          <FormLabel>Payment Mode</FormLabel>
          <RadioGroup
            row
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <FormControlLabel value="card" control={<Radio />} label="Card" />
            <FormControlLabel value="bank" control={<Radio />} label="Bank Balance" />
          </RadioGroup>

          {paymentType === "card" && (
            <Box mt={2}>
              <TextField
                label="Card Number"
                name="number"
                fullWidth
                margin="dense"
                inputProps={{ maxLength: 16 }}
                value={cardDetails.number}
                onChange={handleInputChange}
              />
              <TextField
                label="CVV"
                name="cvv"
                fullWidth
                margin="dense"
                inputProps={{ maxLength: 3 }}
                value={cardDetails.cvv}
                onChange={handleInputChange}
              />
              <TextField
                label="Expiry (MM/YY)"
                name="expiry"
                fullWidth
                margin="dense"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleInputChange}
              />
            </Box>
          )}

          {paymentType === "bank" && (
            <Box mt={2}>
              <strong>Your Bank Balance:</strong> ₹ 1,00,000
              <p>(Just a mock message — replace with real balance if needed)</p>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmPayment}>
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyStatementLoanDetails;
