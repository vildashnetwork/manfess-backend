import db from "../../middlewares/db.js";
import express from "express";

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/subjects
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM subjects WHERE Cycle = 'first_cycle'");
    res.status(200).json(results);
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
