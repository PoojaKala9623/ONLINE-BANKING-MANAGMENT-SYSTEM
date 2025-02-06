const { generateAdminsToken } = require("./Backend/helpers/generateAdminsToken");

console.log(generateAdminsToken("60d0fe4f5311236168a109ca", "vignesh123@example.com", "admin"));


console.log("StrongPassword123!");


const bcrypt = require("bcryptjs");

const hashPassword = async (req, res) => {
    const hashedPassword= await bcrypt.hash("StrongPassword123!", 10);
    console.log(hashedPassword);

}

hashPassword();

