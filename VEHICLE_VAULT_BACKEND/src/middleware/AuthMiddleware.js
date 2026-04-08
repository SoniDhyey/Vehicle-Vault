const jwt = require("jsonwebtoken");
const secret = "secret"; // Use process.env.JWT_SECRET in production

const validatetoken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        message: token ? "Token is not Bearer" : "Token not present"
      });
    }

    const tokenValue = token.split(" ")[1];
    const decodedData = jwt.verify(tokenValue, secret);

    // FIXED: Ensure req.user._id exists regardless of payload key name
    req.user = {
      ...decodedData,
      _id: decodedData._id || decodedData.id 
    };
    
    next();

  } catch (err) {
    console.error("JWT ERROR:", err.name); 

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired, please login again"
      });
    }

    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = validatetoken;