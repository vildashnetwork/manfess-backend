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