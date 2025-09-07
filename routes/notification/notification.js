import db from "../../middlewares/db.js";
import express from "express";

const router = express.Router();

// Get all notifications
router.get("/", (req, res) => {
  db.query("SELECT * FROM notifications ORDER BY createdAt DESC", (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database query error" });
    }
    res.status(200).json(results);
  });
});

// Add a new notification
router.post("/add", (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

  // Only one placeholder for one value
  db.query(
    "INSERT INTO notifications (message, createdAt) VALUES (?, NOW())",
    [message],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database query error" });
      }
      res.status(201).json({ id: results.insertId, message, createdAt: new Date() });
    }
  );
});

export default router;
