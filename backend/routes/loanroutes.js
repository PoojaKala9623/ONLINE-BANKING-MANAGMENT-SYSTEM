const express = require("express");
const { applyloan, loanUpdateStatus, getallloans, getspecificloan, getloanStatement, payemi, getTransactionHistory } = require("../controllers/loanController");


const router = express.Router();

// authUserProtect
router.post("/apply",applyloan)
router.put("/:loanId",loanUpdateStatus)
router.get("/",getallloans)
router.get("/:loanId",getspecificloan)
router.get("/loanstatement/:loanId",getloanStatement)

router.put("/payemi/:emiid",payemi)
router.get("/accounts/:clientId/transactions",getTransactionHistory)




module.exports = router;