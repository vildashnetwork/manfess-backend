// import jwt from "jsonwebtoken"
// import dotenv from "dotenv"
// dotenv.config()

// const protect = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         try {
//             token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.admin = decoded.userId;
//             next();
//         } catch (error) {
//             console.error(error);
//             res.status(401).json({ message: "Not authorized, token failed" });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: "Not authorized, no token" });
//     }
// };

// export default protect;







import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach admin ID to request
      req.admin = decoded.userId;

      return next(); // 🚀 must call next or request hangs
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // if no token
  return res.status(401).json({ message: "Not authorized, no token" });
};

export default protect;
