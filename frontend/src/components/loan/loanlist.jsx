import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import { url } from "../../config/config";

const statusColors = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
  Disbursed: "primary",
  Cancelled: "secondary",
};

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    axios.get(`${url}api/loans`)
      .then(response => {
        setLoans(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching loans:", error);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (loanId, newStatus) => {
    setUpdating(true);
    axios.put(`${url}api/loans/${loanId}`, { status: newStatus })
      .then(response => {
        setLoans(prevLoans => prevLoans.map(loan => 
          loan._id === loanId ? { ...loan, status: newStatus } : loan
        ));
        setUpdating(false);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        setUpdating(false);
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1e88e5" }}>
        Loan Applications
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ background: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>User ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Loan Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Amount (₹)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tenure</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Interest Rate (%)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>EMI (₹)</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Applied Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan._id} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f3f3f3" } }}>
                <TableCell>{loan.userId}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell>₹{loan.loanAmount}</TableCell>
                <TableCell>{loan.tenure} months</TableCell>
                <TableCell>{loan.interestRate}%</TableCell>
                <TableCell>₹{loan.emi}</TableCell>
                <TableCell>
                  <Select
                    value={loan.status}
                    onChange={(e) => handleStatusChange(loan._id, e.target.value)}
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      boxShadow: 2,
                      fontWeight: "bold",
                      color: statusColors[loan.status] ? statusColors[loan.status] : "default",
                    }}
                    disabled={updating}
                  >
                    {Object.keys(statusColors).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{new Date(loan.appliedAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LoanList;
