// routes/timetable.js
import express from "express";
import db from "../../middlewares/db.js";

const router = express.Router();

///api/teachers/timetable/add
router.post("/add", async (req, res) => {
  try {
    const { 
      Day, 
      "04:30-05:20": slot1, 
      "05:20-06:10": slot2, 
      "06:10-07:00": slot3, 
      "07:00-07-50": slot4, 
      "07-50-09-00": slot5, 
      Teachers 
    } = req.body;

    if (!Day || !Teachers) {
      return res.status(400).json({ error: "Day and Teachers fields are required" });
    }

    // Step 1: Check if teacher already has timetable for this day
    const [existing] = await db.query(
      "SELECT id FROM teachers_timestable WHERE Day = ? AND Teachers = ?",
      [Day, Teachers]
    );

    if (existing.length > 0) {
      // Step 2: Update if exists
      const sqlUpdate = `
        UPDATE teachers_timestable 
        SET \`04:30-05:20\`=?, 
            \`05:20-06:10\`=?, 
            \`06:10-07:00\`=?, 
            \`07:00-07-50\`=?, 
            \`07-50-09-00\`=? 
        WHERE Day=? AND Teachers=?;
      `;

      await db.query(sqlUpdate, [
        slot1 || null,
        slot2 || null,
        slot3 || null,
        slot4 || null,
        slot5 || null,
        Day,
        Teachers
      ]);

      return res.status(200).json({ success: true, message: "Timetable updated" });
    } else {
      // Step 3: Insert if not exists
      const sqlInsert = `
        INSERT INTO teachers_timestable
        (Day, \`04:30-05:20\`, \`05:20-06:10\`, \`06:10-07:00\`, \`07:00-07-50\`, \`07-50-09-00\`, Teachers)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(sqlInsert, [
        Day,
        slot1 || null,
        slot2 || null,
        slot3 || null,
        slot4 || null,
        slot5 || null,
        Teachers
      ]);

      return res.status(201).json({ success: true, message: "Timetable added", id: result.insertId });
    }
  } catch (err) {
    console.error("Error inserting/updating timetable:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ----------------------------
// Get timetable by teacher
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { teacherName } = req.body;

    if (!teacherName) {
      return res.status(400).json({ error: "teacherName is required" });
    }

    const sql = "SELECT * FROM teachers_timestable WHERE Teachers = ? ORDER BY Day ASC";
    const [rows] = await db.query(sql, [teacherName]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching timetable:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
