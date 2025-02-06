const jwt = require("jsonwebtoken");

const generateAdminsToken = (id, email, role) => {
  
  return jwt.sign({ id, email, role }, "hdhdwehdhuhuwhhhu");
};

module.exports = {
  generateAdminsToken,
};
