const express = require("express");
const { authUserProtect } = require("../middlewares/userMiddleware/authUsersMiddleware");
const { paybill } = require("../controllers/billcontroler");

const router = express.Router();

// authUserProtect
router.post("/pay",paybill)

module.exports = router;