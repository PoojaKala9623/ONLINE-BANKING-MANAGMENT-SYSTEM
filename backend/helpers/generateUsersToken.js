const jwt = require("jsonwebtoken");

const key = process.env.JWT_SECRET||"hdhdwehdhuhuwhhhu";

const generateUsersToken = (id, email) => {
  console.log(jwt.sign({ id, email },key ));
  
  return jwt.sign({ id, email },key );
};

module.exports = {
  generateUsersToken,
};
