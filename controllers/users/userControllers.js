const mySQLPool = require("../../config/db");
const { handleError, sendResponse } = require("../../utils/responseHandler");
const { validationFields } = require("../../utils/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const requiredFields = ["name", "email", "password"];
    const validation = validationFields(requiredFields, req.body);
    if (!validation.success) {
      return sendResponse(res, 400, false, validation.message);
    }
    const { name, email, password, role } = req.body;

    //! Check if user already exists
    const [alreadyUser] = await mySQLPool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (alreadyUser.length > 0) {
      return sendResponse(res, 400, false, "User already exists");
    }

    /*
    //! Password validation using regular expressions
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return sendResponse(res, 400, false, "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.");
    }
    */

    //! Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    //! Insert user's data into DB
    await mySQLPool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    //! Get total number of users in the DB
    const [rows] = await mySQLPool.query("SELECT COUNT(*) AS total FROM users");
    const total = rows[0].total;
    //! Making response data format
    const responseData = {
      name,
      email,
      password,
      role,
    };
    return sendResponse(
      res,
      200,
      true,
      "User created successfully",
      responseData,
      total
    );
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //! Validation for required fields
    if (!email || !password) {
      return sendResponse(res, 400, false, "Please provide email and password");
    }
    //! Fetch user from DB by email
    const [user] = await mySQLPool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    //! Check if user exists
    if (user.length === 0) {
      return sendResponse(res, 404, false, "User not found");
    }
    //! Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);
    if (!isPasswordCorrect) {
      return sendResponse(res, 400, false, "Invalid email or password");
    }
    //! Generate access token
    const accessToken = jwt.sign(
      { userId: user[0].id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_SECRET }
    );
    //! Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user[0].id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_SECRET }
    );

    const responseData = {
      message: "Login successful",
      accessToken,
      refreshToken,
    };
    return sendResponse(res, 200, true, "Login successful", responseData);
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

module.exports = {
  signUp,
  login,
};
