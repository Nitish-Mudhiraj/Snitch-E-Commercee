const jwt = require("jsonwebtoken");
const User = require("../schema/userschema");

async function productMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  

    const user = await User.findById(decoded.id);

    

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.role !== "seller") {
      return res.status(403).json({
        message: "You are not eligible for this role",
      });
    }

    req.user = user;


    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

module.exports = productMiddleware;