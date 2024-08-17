const jwt = require("jsonwebtoken");
const { sendResponse } = require("./responseHandler");

/*
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Token From Frontend: ", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log('Token response:', token);

  if (!token) {
    return sendResponse(res, 401, false, "Access Denied: No token provided");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return sendResponse(res, 401, false, "Access Denied: Invalid token");
    }
    req.user = user;
    next();
  });
};
*/
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header: ", authHeader);
  if (!authHeader) {
    return sendResponse(res, 401, false, "Access Denied: No token provided");
  }
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return sendResponse(res, 401, false, "Access Denied: Incorrect token");
  }
  const token = tokenParts[1];
  console.log("Extracted Token:", token);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      console.error("JWT Verification Error:", error.name, error.message);
      if (error.name === "TokenExpiredError") {
        return sendResponse(
          res,
          401,
          false,
          "Access Denied: Token has expired"
        );
      } else if (error.name === "JsonWebTokenError") {
        return sendResponse(res, 401, false, "Access Denied: Invalid token");
      } else {
        return sendResponse(
          res,
          401,
          false,
          "Access Denied: Failed to authenticate token"
        );
      }
    }
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, false, "Forbidden");
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
