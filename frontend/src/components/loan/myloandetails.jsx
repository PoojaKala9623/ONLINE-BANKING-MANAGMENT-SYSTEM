import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";
import { url } from "../../config/config";
import MyStatementLoanDetails from "./loanstatement/myloanstatement";

const LoanDetailsComponent = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { account } = useSelector((state) => state.userAccount);

  useEffect(() => {
    axios
      .get(`${url}api/loans/${account.client_id}`)
      .then((res) => {
        setLoans(res.data || []);
      })
      .catch((err) => console.error("Error fetching loans:", err))
      .finally(() => setLoading(false));
  }, []);

  const generateSchedule = (loan) => {
    const startDate = dayjs(loan.appliedAt);
    return Array.from({ length: loan.tenure }, (_, i) => ({
      month: i + 1,
      dueDate: startDate.add(i, "month").format("DD MMM YYYY"),
      amount: loan.emi,
      status: "Pending", // replace with real data if you store payment status
    }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!loans.length) {
    return (
      <Typography variant="h6" align="center" color="error">
        No loans found for this user.
      </Typography>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}
    >
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        All Loan Details
      </Typography>

      {loans.map((loan, loanIndex) => {
        const schedule = generateSchedule(loan);
        return (
          <div key={loan._id} style={{ marginBottom: "4rem" }}>
            <Typography variant="h6" color="secondary" gutterBottom>
              Loan #{loanIndex + 1}
            </Typography>

            {/* Loan Summary Cards */}
            <Grid container spacing={2} marginBottom={2}>
              {[
                { label: "Loan Type", value: loan.loanType },
                { label: "Loan Amount", value: `₹ ${loan.loanAmount.toLocaleString()}` },
                { label: "Interest Rate", value: `${loan.interestRate}%` },
                { label: "Tenure", value: `${loan.tenure} months` },
                { label: "EMI", value: `₹ ${loan.emi.toFixed(2)}` },
                {
                  label: "Status",
                  value: loan.status,
                  color: loan.status === "Approved" ? "green" : "red",
                },
              ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="subtitle2" color="textSecondary">
                        {item.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        style={{ color: item.color || "inherit" }}
                      >
                        {item.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* EMI Table */}
            <Typography variant="h6" gutterBottom>
              Loan Statement
            </Typography>
            <Paper elevation={3}>
             <MyStatementLoanDetails loanId={loan._id}/>
            </Paper>

            {/* Divider between loans */}
            {loanIndex < loans.length - 1 && <Divider sx={{ my: 5 }} />}
          </div>
        );
      })}
    </motion.div>
  );
};

export default LoanDetailsComponent;
