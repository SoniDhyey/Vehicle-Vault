const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "secret";

const validatetoken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        message: token ? "Token is not Bearer" : "Token not present"
      });
    }

    const tokenValue = token.split(" ")[1];
    
    // ✅ Verify with the exact same secret used in the Controller
    const decodedData = jwt.verify(tokenValue, secret);

    // ✅ Map payload to req.user
    req.user = {
      _id: decodedData._id,
      role: decodedData.role
    };
    
    next();

  } catch (err) {
    console.error("JWT ERROR:", err.name); 

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please login again" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = validatetoken;