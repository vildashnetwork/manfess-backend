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











import protect from "../../middlewares/meauth.js";

import express from "express";
import db from '../../middlewares/db.js'; 
const router = express.Router();
//url: https://manfess-backend.onrender.com/api/admin/me
router.get("/",protect, (req, res) => {
    try{
    db.query("SELECT * FROM admins WHERE id = ?", [req.admin], (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results[0]);
})
    }catch(error){
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
});

export default router;