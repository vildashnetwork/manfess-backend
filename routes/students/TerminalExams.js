import express from "express";
import db from "../../middlewares/db.js";

const router = express.Router();

// ✅ Fetch students (from both tables)
router.get("/students/all", (req, res) => {
  const { class: className, department } = req.query;

  const query1 = `
    SELECT localid, id, FirstName, LastName, DOB, ParentName, FeesComplete,
           level, AmountPaid, ExpectedAmount, BalanceLeft, SchoolYear, Department
    FROM students
    WHERE (? IS NULL OR level = ?) AND (? IS NULL OR Department = ?)
  `;

  const query2 = `
    SELECT localid, id, FirstName, LastName, DOB, ParentName, FeesComplete,
           level, AmountPaid, ExpectedAmount, BalanceLeft, SchoolYear, Department
    FROM studentsalevel
    WHERE (? IS NULL OR level = ?) AND (? IS NULL OR Department = ?)
  `;

  db.query(query1, [className || null, className || null, department || null, department || null], (err1, res1) => {
    if (err1) return res.status(500).json({ error: "DB error: " + err1.message });

    db.query(query2, [className || null, className || null, department || null, department || null], (err2, res2) => {
      if (err2) return res.status(500).json({ error: "DB error: " + err2.message });

      // merge results in JS instead of UNION
      const merged = [...res1, ...res2];
      res.json(merged);
    });
  });
});

// ✅ Insert or update terminal results
router.post("/terminalresults", (req, res) => {
  const { studentname, Class, Department, Subject, Subject_Code, Mark , sequence} = req.body;

  if (!studentname || !Class || !Department || !Subject || !Subject_Code || !Mark) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const checkQuery = `
    SELECT id FROM terminalresults 
    WHERE studentname = ? AND Subject = ? AND sequence = ?
  `;

  db.query(checkQuery, [studentname, Subject, sequence], (err, results) => {
    if (err) {
      console.error("Error checking terminal result:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      const updateQuery = `
        UPDATE terminalresults 
        SET Mark = ?, Class = ?, Department = ?, Subject_Code = ?
        WHERE studentname = ? AND Subject = ? AND sequence = ?
      `;
      db.query(
        updateQuery,
        [Mark, Class, Department, Subject_Code, studentname, Subject, sequence],
        (err2) => {
          if (err2) {
            console.error("Error updating terminal result:", err2);
            return res.status(500).json({ error: "Database error" });
          }
          res.json({ message: "Existing record updated" });
        }
      );
    } else {
      const insertQuery = `
        INSERT INTO terminalresults (studentname, Class, Department, Subject, Subject_Code, Mark, sequence)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [studentname, Class, Department, Subject, Subject_Code, Mark, sequence],
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
