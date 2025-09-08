import express from "express";
import db from "../../middlewares/db.js";

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/admin
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM admins");
    res.status(200).json(results);
  } catch (error) {
    console.error("Database query error:", error.message);
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
