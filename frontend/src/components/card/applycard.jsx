import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const ApplyCardForm = () => {
  const [cardType, setCardType] = useState("debit");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
  const {
    account,
    isError,
    isLoading: isUserAccountLoading,
    message,
  } = useSelector((state) => state.userAccount);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!limit || isNaN(limit)) {
      return setAlert({ open: true, type: "error", message: "Limit must be a number." });
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/card/apply", {
        user_id: account.client_id,
        type: cardType,
        limit: Number(limit),
      });
      setAlert({ open: true, type: "success", message: res.data.message });
      setLimit("");
    } catch (err) {
      setAlert({ open: true, type: "error", message: err.response?.data?.message || "Error applying for card." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 2,
        borderRadius: "2xl",
        boxShadow: 5,
        background: "linear-gradient(to right, #e0f7fa, #ffffff)",
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Apply for a New Card
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Card Type"
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
            margin="normal"
          >
            <MenuItem value="debit">Debit Card</MenuItem>
            <MenuItem value="credit">Credit Card</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Transaction Limit (L.E)"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            margin="normal"
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, borderRadius: 3 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Apply Now"}
          </Button>
        </form>
      </CardContent>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.type}>{alert.message}</Alert>
      </Snackbar>
    </Card>
  );
};

export default ApplyCardForm;
