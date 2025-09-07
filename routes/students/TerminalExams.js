import express from "express";
import db from "../../middlewares/db.js";

const router = express.Router();

// ✅ Fetch students (from both tables)
router.get("/students/all", (req, res) => {
  const { class: className, department } = req.query;

  const query1 = `
    SELECT 
      localid, id, FirstName, LastName, DOB, ParentName, FeesComplete,
      level, AmountPaid, ExpectedAmount, BalanceLeft, SchoolYear, Department
    FROM students
    WHERE (? IS NULL OR level = ?)
      AND (? IS NULL OR Department = ?)
  `;

  const query2 = `
    SELECT 
      localid, id, FirstName, LastName, DOB, ParentName, FeesComplete,
      level, AmountPaid, ExpectedAmount, BalanceLeft, SchoolYear, Department
    FROM studentsalevel
    WHERE (? IS NULL OR level = ?)
      AND (? IS NULL OR Department = ?)
  `;

  const params = [className || null, className || null, department || null, department || null];

  db.query(query1, params, (err1, results1) => {
    if (err1) {
      console.error("Error fetching students (students table):", err1);
      return res.status(500).json({ error: "Database error (students)" });
    }

    db.query(query2, params, (err2, results2) => {
      if (err2) {
        console.error("Error fetching students (studentsalevel table):", err2);
        return res.status(500).json({ error: "Database error (studentsalevel)" });
      }

      // ✅ Merge results in Node instead of UNION
      const allStudents = [...results1, ...results2];
      res.json(allStudents);
    });
  });
});

// ✅ Insert or update terminal results
router.post("/terminalresults", (req, res) => {
  const { studentname, Class, Department, Subject, Subject_Code, Mark } = req.body;

  if (!studentname || !Class || !Department || !Subject || !Subject_Code || !Mark) {
    return res.status(400).json({ error: "All fields are required" });
  }

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
      const updateQuery = `
        UPDATE terminalresults 
        SET Mark = ?, Class = ?, Department = ?, Subject_Code = ?
        WHERE studentname = ? AND Subject = ?
      `;
      db.query(
        updateQuery,
        [Mark, Class, Department, Subject_Code, studentname, Subject],
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
