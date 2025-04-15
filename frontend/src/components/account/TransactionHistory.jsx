import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useSelector } from "react-redux";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");  const {
      account,
      isError,
      isLoading: isUserAccountLoading,
      message,
    } = useSelector((state) => state.userAccount);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/loans/accounts/${account.client_id}/transactions`);
        setTransactions(res.data.transactions);
        setFilteredTransactions(res.data.transactions);
      } catch (err) {
        console.error("Error fetching transaction history:", err);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (filterType !== "All") {
      filtered = filtered.filter(txn => txn.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(txn =>
        txn.amount.toString().includes(searchTerm) ||
        txn.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(txn.date).toLocaleDateString().includes(searchTerm)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filterType, transactions]);

  return (
    <Paper className="p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl size="small" className="min-w-[150px]">
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterType}
            label="Filter"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="IN">IN</MenuItem>
            <MenuItem value="OUT">OUT</MenuItem>
          </Select>
        </FormControl>
      </div>

      <TableContainer>
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-bold">Type</TableCell>
              <TableCell className="font-bold">To / From</TableCell>
              <TableCell className="font-bold">Amount (₹)</TableCell>
              <TableCell className="font-bold">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((txn, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className={`font-semibold ${txn.type === "IN" ? "text-green-600" : "text-red-500"}`}>
                  {txn.type}
                </TableCell>
                <TableCell>{txn.type === "IN" ? txn.from : txn.to}</TableCell>
                <TableCell>₹ {txn.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(txn.date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No transactions found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TransactionHistory;
