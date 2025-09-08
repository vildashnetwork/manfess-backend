import e from "express";
import db from "../../middlewares/db.js";
const router = e.Router();

// url: https://manfess-backend.onrender.com/api/students
router.get("/", async (req, res) => {
  const q = "SELECT DISTINCT localid, id, FirstName, LastName, level, Department FROM students WHERE level= 'Level 5'";
  try {
    const [data] = await db.query(q);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Database query error:", err.message);
    return res.status(500).json({ error: "Database query error" });
  }
});

// url: https://manfess-backend.onrender.com/api/students/all
router.get("/all", async (req, res) => {
  const q = "SELECT DISTINCT level FROM students";
  try {
    const [data] = await db.query(q);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Database query error:", err.message);
    return res.status(500).json({ error: "Database query error" });
  }
});

export default router;
