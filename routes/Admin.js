import express from "express";
import db from '../middlewares/db.js'; 
const router = express.Router();

router.get("/users", (req, res) => {
    try{
  db.query("SELECT * FROM admins", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  })
    }catch(error){
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }

});
export default router;