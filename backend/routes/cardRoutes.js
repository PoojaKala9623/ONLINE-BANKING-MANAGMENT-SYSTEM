const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");

router.post("/apply", cardController.applyCard);
// admin routes
router.patch("/block/:id", cardController.blockCard);
router.patch("/limit/:id", cardController.setTransactionLimit);

// user routes and admin routes

router.get("/statements/:id", cardController.getStatements);
router.get("/rewards/:id", cardController.getRewardPoints);
router.get("/all", cardController.getAllCards);
router.get("/user/:userId", cardController.getUserCards);
router.put("/:id", cardController.updatecardStatus);
router.post("/statements/:id", cardController.addStatement);
router.post("/rewards/:id", cardController.addRewardPoints);



module.exports = router;
