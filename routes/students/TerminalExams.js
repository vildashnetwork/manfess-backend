// import express from "express";
// import db from "../../middlewares/db.js";

// const router = express.Router();

// // ✅ Fetch students (from both tables)
// router.get("/students/all", (req, res) => {
//   const { class: className, department } = req.query;

//   const query1 = `
//     SELECT localid, id, FirstName, LastName, DOB, ParentName, FeesComplete,
//            level, AmountPaid, ExpectedAmount, BalanceLeft, SchoolYear, Department
//     FROM students
//     WHERE (? IS NULL OR level = ?) AND (? IS NULL OR Department = ?)
//   `;

//   const query2 = `
//     SELECT localid, id, FirstName, LastName, DOB, ParentName, FeesComplete,
//            level, AmountPaid, ExpectedAmount, BalanceLeft, SchoolYear, Department
//     FROM studentsalevel
//     WHERE (? IS NULL OR level = ?) AND (? IS NULL OR Department = ?)
//   `;

//   db.query(query1, [className || null, className || null, department || null, department || null], (err1, res1) => {
//     if (err1) return res.status(500).json({ error: "DB error: " + err1.message });

//     db.query(query2, [className || null, className || null, department || null, department || null], (err2, res2) => {
//       if (err2) return res.status(500).json({ error: "DB error: " + err2.message });

//       // merge results in JS instead of UNION
//       const merged = [...res1, ...res2];
//       res.json(merged);
//     });
//   });
// });

// // ✅ Insert or update terminal results (single or batch)
// router.post("/terminalresults", (req, res) => {
//   const payload = req.body;

//   // CASE 1: Batch (array of results)
//   if (Array.isArray(payload)) {
//     if (!payload.length) {
//       return res.status(400).json({ error: "Empty results array" });
//     }

//     const tasks = payload.map((rec) => {
//       return new Promise((resolve, reject) => {
//         const { studentname, Class, Department, Subject, Subject_Code, Mark, sequence } = rec;

//         if (!studentname || !Class || !Department || !Subject || !Subject_Code || Mark == null || !sequence) {
//           return reject(`Missing fields in record: ${JSON.stringify(rec)}`);
//         }

//         const checkQuery = `
//           SELECT id FROM terminalresults 
//           WHERE studentname = ? AND Subject = ? AND sequence = ?
//         `;

//         db.query(checkQuery, [studentname, Subject, sequence], (err, results) => {
//           if (err) return reject(err);

//           if (results.length > 0) {
//             const updateQuery = `
//               UPDATE terminalresults 
//               SET Mark = ?, Class = ?, Department = ?, Subject_Code = ?
//               WHERE studentname = ? AND Subject = ? AND sequence = ?
//             `;
//             db.query(updateQuery, [Mark, Class, Department, Subject_Code, studentname, Subject, sequence], (err2) => {
//               if (err2) return reject(err2);
//               resolve({ studentname, status: "updated" });
//             });
//           } else {
//             const insertQuery = `
//               INSERT INTO terminalresults (studentname, Class, Department, Subject, Subject_Code, Mark, sequence)
//               VALUES (?, ?, ?, ?, ?, ?, ?)
//             `;
//             db.query(insertQuery, [studentname, Class, Department, Subject, Subject_Code, Mark, sequence], (err3, result) => {
//               if (err3) return reject(err3);
//               resolve({ studentname, status: "inserted", id: result.insertId });
//             });
//           }
//         });
//       });
//     });

//     Promise.allSettled(tasks).then((results) => {
//       res.json({ message: "Batch processed", results });
//     });
//   } 
  
//   // CASE 2: Single record
//   else {
//     const { studentname, Class, Department, Subject, Subject_Code, Mark, sequence } = payload;

//     if (!studentname || !Class || !Department || !Subject || !Subject_Code || Mark == null || !sequence) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const checkQuery = `
//       SELECT id FROM terminalresults 
//       WHERE studentname = ? AND Subject = ? AND sequence = ?
//     `;

//     db.query(checkQuery, [studentname, Subject, sequence], (err, results) => {
//       if (err) {
//         console.error("Error checking terminal result:", err);
//         return res.status(500).json({ error: "Database error" });
//       }

//       if (results.length > 0) {
//         const updateQuery = `
//           UPDATE terminalresults 
//           SET Mark = ?, Class = ?, Department = ?, Subject_Code = ?
//           WHERE studentname = ? AND Subject = ? AND sequence = ?
//         `;
//         db.query(updateQuery, [Mark, Class, Department, Subject_Code, studentname, Subject, sequence], (err2) => {
//           if (err2) {
//             console.error("Error updating terminal result:", err2);
//             return res.status(500).json({ error: "Database error" });
//           }
//           res.json({ message: "Existing record updated" });
//         });
//       } else {
//         const insertQuery = `
//           INSERT INTO terminalresults (studentname, Class, Department, Subject, Subject_Code, Mark, sequence)
//           VALUES (?, ?, ?, ?, ?, ?, ?)
//         `;
//         db.query(insertQuery, [studentname, Class, Department, Subject, Subject_Code, Mark, sequence], (err3, result) => {
//           if (err3) {
//             console.error("Error inserting terminal result:", err3);
//             return res.status(500).json({ error: "Database error" });
//           }
//           res.json({ message: "New record inserted", id: result.insertId });
//         });
//       }
//     });
//   }
// });

// export default router;











import express from 'express';
import db from '../../middlewares/db.js';

const router = express.Router();

// ✅ Fetch students (from both tables)
router.get("/students/all/students", async (req, res) => {
  try {
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

    const [res1] = await db.query(query1, [className || null, className || null, department || null, department || null]);
    const [res2] = await db.query(query2, [className || null, className || null, department || null, department || null]);

    res.status(200).json([...res1, ...res2]);
  } catch (error) {
    console.error("Error fetching students:", error.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Insert or update terminal results (single or batch)
router.post("/terminalresults", async (req, res) => {
  try {
    const payload = req.body;

    const resultsArray = Array.isArray(payload) ? payload : [payload];

    if (!resultsArray.length) {
      return res.status(400).json({ error: "Empty results array" });
    }

    const response = [];

    for (const rec of resultsArray) {
      const { studentname, Class, Department, Subject, Subject_Code, Mark, sequence } = rec;

      if (!studentname || !Class || !Department || !Subject || !Subject_Code || Mark == null || !sequence) {
        response.push({ studentname, status: "failed", reason: "Missing required fields" });
        continue;
      }

      const [existing] = await db.query(
        `SELECT id FROM terminalresults WHERE studentname = ? AND Subject = ? AND sequence = ?`,
        [studentname, Subject, sequence]
      );

      if (existing.length > 0) {
        await db.query(
          `UPDATE terminalresults SET Mark = ?, Class = ?, Department = ?, Subject_Code = ? 
           WHERE studentname = ? AND Subject = ? AND sequence = ?`,
          [Mark, Class, Department, Subject_Code, studentname, Subject, sequence]
        );
        response.push({ studentname, status: "updated" });
      } else {
        const [result] = await db.query(
          `INSERT INTO terminalresults (studentname, Class, Department, Subject, Subject_Code, Mark, sequence)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [studentname, Class, Department, Subject, Subject_Code, Mark, sequence]
        );
        response.push({ studentname, status: "inserted", id: result.insertId });
      }
    }

    res.status(200).json({ message: "Operation completed", results: response });
  } catch (error) {
    console.error("Error processing terminal results:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/firstsequence", async(req,res)=>{
  try {
    const [rows] = await db.query(`SELECT * FROM terminalresults WHERE sequence = 'First Sequence'`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})
router.get("/secondsequence", async(req,res)=>{
  try {
    const [rows] = await db.query(`SELECT * FROM terminalresults WHERE sequence = 'Second Sequence'`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})
router.get("/thirdsequence", async(req,res)=>{
  try {
    const [rows] = await db.query(`SELECT * FROM terminalresults WHERE sequence = 'Third Sequence'`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})
router.get("/fourthsequence", async(req,res)=>{
  try {
    const [rows] = await db.query(`SELECT * FROM terminalresults WHERE sequence = 'Fourth Sequence'`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})
router.get("/fifthsequence", async(req,res)=>{
  try {
    const [rows] = await db.query(`SELECT * FROM terminalresults WHERE sequence = 'Fifth Sequence'`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})
router.get("/sixthsequence", async(req,res)=>{
  try {
    const [rows] = await db.query(`SELECT * FROM terminalresults WHERE sequence = 'Sixth Sequence'`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
})

export default router;
