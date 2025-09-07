// routes/timetable.js
import express from "express";
import db from "../../middlewares/db.js";

const router = express.Router();

///api/teachers/timetable
router.post("/add", (req, res) => {
  const { Day, "04:30-05:20": slot1, "05:20-06:10": slot2, "06:10-07:00": slot3, "07:00-07-50": slot4, "07-50-09-00": slot5, Teachers } = req.body;

  if (!Day || !Teachers) {
    return res.status(400).json({ error: "Day and Teachers fields are required" });
  }

  const sql = `
    INSERT INTO teachers_timestable
    (Day, \`04:30-05:20\`, \`05:20-06:10\`, \`06:10-07:00\`, \`07:00-07-50\`, \`07-50-09-00\`, Teachers)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [Day, slot1 || null, slot2 || null, slot3 || null, slot4 || null, slot5 || null, Teachers])
    .then(([result]) => {
      res.status(201).json({ success: true, id: result.insertId });
    })
    .catch(err => {
      console.error("Error inserting timetable:", err);
      res.status(500).json({ error: "Database error" });
    });
});

// ----------------------------
// Get timetable by teacher
// ----------------------------
router.get("/", (req, res) => {
  const { teacherName } = req.body;

  const sql = "SELECT * FROM teachers_timestable WHERE Teachers = ? ORDER BY Day ASC";

  db.query(sql, [teacherName])
    .then(([rows]) => {
      res.json(rows);
    })
    .catch(err => {
      console.error("Error fetching timetable:", err);
      res.status(500).json({ error: "Database error" });
    });
});

export default router;
