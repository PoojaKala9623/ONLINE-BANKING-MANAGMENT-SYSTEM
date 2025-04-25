import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Select, MenuItem, Button, FormControl, InputLabel
} from "@mui/material";
import { Save, PictureAsPdf, FileDownload } from "@mui/icons-material";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const statusOptions = ["active", "inactive", "suspended", "pending"];

const CardTable = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, statusFilter, data]);

  const fetchCards = async () => {
    const res = await axios.get("http://localhost:5000/api/card/all");
    setData(res.data.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/card/${id}`, { status });
    fetchCards();
  };

  const handleBlock = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/card/block/${id}`);
      fetchCards();
    } catch (error) {
      console.error("Block failed:", error);
    }
  };


  const filterData = () => {
    let result = [...data];
    if (search) {
      result = result.filter(item =>
        item.user_id.user_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    setFiltered(result);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(item => ({
      Name: item.user_id.user_name,
      Email: item.user_id.email,
      CardNumber: item.card_number,
      CardType: item.card_type,
      Status: item.status,
      ExpiryDate: new Date(item.expiry_date).toLocaleDateString(),
      TransactionLimit: item.transaction_limit,
      Rewards: item.rewards_points
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cards");
    XLSX.writeFile(wb, "cards.xlsx");
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Card Details", 10, 10);
    let y = 20;
    filtered.forEach((item, idx) => {
      doc.setFontSize(12);
      doc.text(`Name: ${item.user_id.user_name}`, 10, y);
      doc.text(`Email: ${item.user_id.email}`, 10, y + 6);
      doc.text(`Card Number: ${item.card_number}`, 10, y + 12);
      doc.text(`Type: ${item.card_type} | Status: ${item.status}`, 10, y + 18);
      doc.text(`Expiry: ${new Date(item.expiry_date).toLocaleDateString()} | Rewards: ${item.rewards_points}`, 10, y + 24);
      y += 35;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("cards.pdf");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status Filter"
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="flex gap-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownload />}
            onClick={exportExcel}
          >
            Excel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdf />}
            onClick={exportPdf}
          >
            PDF
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Card Number</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Change Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(card => (
              <TableRow key={card._id}>
                <TableCell>{card.user_id.user_name}</TableCell>
                <TableCell>{card.user_id.email}</TableCell>
                <TableCell>{card.card_number}</TableCell>
                <TableCell>{card.card_type}</TableCell>
                <TableCell>{card.status}</TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={card.status}
                    onChange={(e) => updateStatus(card._id, e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>

                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    disabled={card.is_blocked}
                    onClick={() => handleBlock(card._id)}
                  >
                    {card.is_blocked ? "Blocked" : "Block"}
                  </Button>


                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CardTable;
