const express = require("express");
const { applyloan, loanUpdateStatus, getallloans, getspecificloan } = require("../controllers/loanController");


const router = express.Router();

// authUserProtect
router.post("/apply",applyloan)
router.put("/:loanId",loanUpdateStatus)
router.get("/",getallloans)
router.get("/:loanId",getspecificloan)


module.exports = router;