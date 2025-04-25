const Card = require("../models/card");

function generateCardNumber(cardType = "debit") {
    let prefix = "4"; // default to Visa-like
    if (cardType === "credit") prefix = "5"; // MasterCard-like
  
    let cardNumber = prefix;
  
    for (let i = 0; i < 14; i++) {
      cardNumber += Math.floor(Math.random() * 10);
    }
  
    // Add checksum digit using Luhn algorithm
    cardNumber += getLuhnCheckDigit(cardNumber);
  
    return cardNumber;
  }
  
  function getLuhnCheckDigit(number) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i]);
  
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
  
      sum += digit;
      shouldDouble = !shouldDouble;
    }
  
    return (10 - (sum % 10)) % 10;
  }


  function generateExpiryDate() {
    const today = new Date();
    const expiryYear = today.getFullYear() + 5;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(expiryYear).slice(-2); // last 2 digits
  
    return `${month}/${year}`; // Example: 04/30
  }
  
  

// Apply for new card
exports.applyCard = async (req, res) => {
  try {

    console.log("Request body:", req.body); // Log the request body
   const  user_id=req.body.user_id

    const existingCard = await Card.findOne({ user_id: user_id });

    if (existingCard) {

      if (existingCard.card_type === req.body.type) {
        
        return  res.status(201).json({ message: "Already applied for this card type" });
        
      }



    }


    
    const expiryDate = generateExpiryDate();
    const testdata=req.body
    testdata.expiry_date=expiryDate
    testdata.card_type=testdata.type

    testdata.card_number=generateCardNumber(testdata.card_type)

    const newCard = await Card.create(testdata);
    res.status(201).json({ message: "Card applied successfully", data: newCard });
  } catch (err) {
    console.log("Error:", err); // Log the error
    
    res.status(400).json({ error: err.message });
  }
};

// Block card
exports.blockCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, { is_blocked: true }, { new: true });
    res.json({ message: "Card blocked", data: card });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Set transaction limit
exports.setTransactionLimit = async (req, res) => {
  try {
    const { limit } = req.body;
    const card = await Card.findByIdAndUpdate(req.params.id, { transaction_limit: limit }, { new: true });
    res.json({ message: "Transaction limit updated", data: card });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get card statements
exports.getStatements = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    res.json({ statements: card.statements });
  } catch (err) {
    res.status(404).json({ error: "Card not found" });
  }
};

// Get rewards points
exports.getRewardPoints = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    res.json({ rewards: card.rewards_points });
  } catch (err) {
    res.status(404).json({ error: "Card not found" });
  }
};


exports.getAllCards = async (req, res) => {
    try {
      const cards = await Card.find().populate("user_id", "user_name email");
      res.status(200).json({
        total: cards.length,
        data: cards,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cards", error: error.message });
    }
  };

  // User: Get own cards
exports.getUserCards = async (req, res) => {
    try {
      const cards = await Card.find({ user_id: req.params.userId });
      res.status(200).json(cards);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  exports.updatecardStatus = async (req, res) => {
    try {
      const cards = await Card.findById( req.params.id );

      cards.status = req.body.status;
      await cards.save();

      res.status(200).json(cards);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };


  exports.addStatement = async (req, res) => {
    try {
      const { amount, description, date } = req.body;
  
      const card = await Card.findById(req.params.id);
      if (!card) return res.status(404).json({ error: "Card not found" });
  
      const newStatement = {
        amount,
        description,
        date: date || new Date(),
      };
  
      card.statements.push(newStatement);
      await card.save();
  
      res.status(200).json({ message: "Statement added", statements: card.statements });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  exports.addRewardPoints = async (req, res) => {
    try {
      const { points } = req.body;
  
      const card = await Card.findById(req.params.id);
      if (!card) return res.status(404).json({ error: "Card not found" });
  
      card.rewards_points = (card.rewards_points || 0) + points;
      await card.save();
  
      res.status(200).json({ message: "Reward points added", rewards: card.rewards_points });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
    
