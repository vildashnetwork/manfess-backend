import express from "express";
import db from "../../../middlewares/db.js";

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/students/alevel
router.get("/", (req, res) => {
  const q = "SELECT localid, id, FirstName, LastName, level, Department FROM studentsalevel WHERE level = 'uppersixth'";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

// url: https://manfess-backend.onrender.com/api/students/alevel/all
router.get("/all", (req, res) => {
  const q = "SELECT DISTINCT level FROM studentsalevel";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

// url: https://manfess-backend.onrender.com/api/students/alevel/subjects
router.get("/subjects", (req, res) => {
  const q = "SELECT * FROM subjects WHERE Cycle = 'second_cycle'";
  db.query(q, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query error" });
    }
    res.status(200).json(results);
  });
});

export default router;
