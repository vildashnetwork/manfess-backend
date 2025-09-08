// import db from "../../middlewares/db.js";
// import express from "express";

// const router = express.Router();

// // Get all notifications
// router.get("/", (req, res) => {
//   db.query("SELECT * FROM notifications ORDER BY Date DESC", (err, results) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ error: "Database query error" });
//     }
//     res.status(200).json(results);
//   });
// });

// // Add a new notification https://manfess-backend.onrender.com/api/notifications/add
// router.post("/add", (req, res) => {
//   const { message } = req.body;

//   if (!message) return res.status(400).json({ error: "Message is required" });

//   // Only one placeholder for one value
//   db.query(
//     "INSERT INTO notifications (message, Date) VALUES (?, NOW())",
//     [message],
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ error: "Database query error" });
//       }
//       res.status(201).json({ id: results.insertId, message, createdAt: new Date() });
//     }
//   );
// });

// export default router;











import express from "express";
import db from "../../middlewares/db.js";

const router = express.Router();

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM notifications ORDER BY Date DESC");
    res.status(200).json(results);
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ error: "Database query error" });
  }
});

// Add a new notification
// url: https://manfess-backend.onrender.com/api/notifications/add
router.post("/add", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO notifications (message, Date) VALUES (?, NOW())",
      [message]
    );
    res.status(201).json({ id: result.insertId, message, createdAt: new Date() });
  } catch (err) {
    console.error("Database insert error:", err.message);
    res.status(500).json({ error: "Database query error" });
  }
});

export default router;
