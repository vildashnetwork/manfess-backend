// import protect from "../../middlewares/meauth.js";

// import express from "express";
// import db from '../../middlewares/db.js'; 
// const router = express.Router();
// //url: https://manfess-backend.onrender.com/api/admin/me
// router.get("/",protect, (req, res) => {
//     try{
//     db.query("SELECT * FROM admins WHERE id = ?", [req.admin], (err, results) => {
//     if (err) {
//         return res.status(500).json({ error: err.message });
//     }
//     res.status(200).json(results[0]);
// })
//     }catch(error){
//         console.log('====================================');
//         console.log(error);
//         console.log('====================================');
//     }
// });

// export default router;





import express from "express";
import db from "../../middlewares/db.js";
import protect from "../../middlewares/meauth.js";

const router = express.Router();

// GET logged-in admin profile
// url: /api/admin/me
router.get("/", protect, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE id = ?", [req.admin]);

    if (!rows.length) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Database query error:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

