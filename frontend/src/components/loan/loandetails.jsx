import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box, CircularProgress, Chip } from "@mui/material";
import axios from "axios";
import { url } from "../../config/config";
import { useSelector } from "react-redux";

const LoanDetails = () => {
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { account } = useSelector((state) => state.userAccount);

  useEffect(() => {
    axios
      .get(`${url}api/loans/${account.client_id}`)
      .then((response) => {
        setLoan(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loan details:", error);
        setLoading(false);
      });
  }, []);

  const handleCancelLoan = () => {
    setCancelLoading(true);
    axios
      .put(`${url}api/loans/${loan._id}`, { action: "cancel" })
      .then((response) => {
        setLoan((prev) => ({ ...prev, status: "Cancelled" }));
        setCancelLoading(false);
      })
      .catch((error) => {
        console.error("Error canceling loan:", error);
        setCancelLoading(false);
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const statusColors = {
    Approved: "success",
    Rejected: "error",
    Pending: "warning",
    Cancelled: "secondary",
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width={"100%"}
      sx={{
        background: "linear-gradient(to right, #2193b0, #6dd5ed)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          padding: 3,
          boxShadow: 8,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1e88e5" }}>
            Loan Details
          </Typography>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Loan Type:</Typography>
            <Typography variant="body1">{loan.loanType}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Amount:</Typography>
            <Typography variant="body1">₹{loan.loanAmount}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Tenure:</Typography>
            <Typography variant="body1">{loan.tenure} months</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>Status:</Typography>
            <Chip label={loan.status} color={statusColors[loan.status]} sx={{ fontWeight: "bold" }} />
          </Box>

          {loan.status === "Pending" && (
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleCancelLoan}
              disabled={cancelLoading}
              sx={{
                mt: 3,
                borderRadius: 3,
                fontWeight: "bold",
                backgroundColor: "#d32f2f",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              {cancelLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Cancel Loan"}
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoanDetails;
