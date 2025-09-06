import express from "express";
import db from "../../middlewares/db.js";

const router = express.Router();

// https://manfess-backend.onrender.com/api/students/all
router.get("/students/all", (req, res) => {
    const { class: className, department } = req.query;
  const query = `
    SELECT 
      
     DISTINCT  localid,
     id,
      FirstName,
      LastName,
      DOB,
      ParentName,
      FeesComplete,
      level,
      AmountPaid,
      ExpectedAmount,
      BalanceLeft,
      SchoolYear,
      Department
    FROM students

    UNION ALL

    SELECT
    
     DISTINCT localid, 
      Id,
      FirstName,
      LastName,
      DOB,
      ParentName,
      FeesComplete,
      level,
      AmountPaid,
      ExpectedAmount,
      BalanceLeft,
      SchoolYear,
      Department
    FROM studentsalevel where class = ? AND Department = ?
  `;

  db.query(query, [className, department], (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// https://manfess-backend.onrender.com/api/terminalresults
router.post("/terminalresults", (req, res) => {
  const { studentname, Class, Department, Subject, Subject_Code, Mark } = req.body;

  if (!studentname || !Class || !Department || !Subject || !Subject_Code || !Mark) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Step 1: Check if student already has marks for this subject
  const checkQuery = `
    SELECT id FROM terminalresults 
    WHERE studentname = ? AND Subject = ?
  `;

  db.query(checkQuery, [studentname, Subject], (err, results) => {
    if (err) {
      console.error("Error checking terminal result:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      // Record exists → Update
      const updateQuery = `
        UPDATE terminalresults 
        SET Mark = ?, Class = ?, Department = ?, Subject_Code = ?
        WHERE studentname = ? AND Subject = ?
      `;

      db.query(
        updateQuery,
        [Mark, Class, Department, Subject_Code, studentname, Subject],
        (err2, result) => {
          if (err2) {
            console.error("Error updating terminal result:", err2);
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ message: "Existing record updated" });
        }
      );
    } else {
      // Record doesn’t exist → Insert
      const insertQuery = `
        INSERT INTO terminalresults (studentname, Class, Department, Subject, Subject_Code, Mark)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [studentname, Class, Department, Subject, Subject_Code, Mark],
        (err3, result) => {
          if (err3) {
            console.error("Error inserting terminal result:", err3);
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ message: "New record inserted", id: result.insertId });
        }
      );
    }
  });
});
export default router;
