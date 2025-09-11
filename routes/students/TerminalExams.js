
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


// router.post("/firstsequence/print/:studentName", async (req, res) => {
//   try {
//     const { studentName } = req.params;

//     const [rows] = await db.query(
//       `SELECT studentname, Class, Subject, Mark, Grade 
//        FROM terminalresults 
//        WHERE sequence = 'First Sequence' AND studentname = ?`,
//       [studentName]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "No results found for this student" });
//     }

//     const doc = new PDFDocument({ margin: 40, size: "A4" });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename=${studentName}_slip.pdf`
//     );

//     doc.pipe(res);

//     // Header
//     doc.image("public/logo.png", 30, 20, { width: 60 }); // company logo
//     doc.image("public/school.png", 500, 20, { width: 60 }); // school logo
//     doc.fontSize(12).text(
//       "BELMON BILINGUAL HIGH SCHOOL\n200 METERS FROM RAIL, OPPOSITE ROYAL CITY, BONABERI – DOUALA - CAMEROON\nTel. 682 55 35 03 / 673 037 555 / 677 517 606\nAUT.Nº: GEN-430/23/MINESEC...\nAUT.Nº: TECH -035/24/MINESEC...",
//       120,
//       30,
//       { align: "center", width: 350 }
//     );

//     doc.moveDown(3).fontSize(16).text("STUDENT REPORT SLIP - FIRST SEQUENCE", {
//       align: "center",
//     });

//     // Student details
//     const studentInfo = rows[0];
//     doc.moveDown().fontSize(14).text(`Name: ${studentInfo.studentname}`);
//     doc.text(`Class: ${studentInfo.Class}`);

//     // Table
//     doc.moveDown().fontSize(12);
//     doc.text("Subject", { continued: true, width: 200 });
//     doc.text("Mark", { continued: true, width: 100, align: "center" });
//     doc.text("Grade", { align: "center" });

//     rows.forEach((r) => {
//       doc.text(r.Subject, { continued: true, width: 200 });
//       doc.text(r.Mark.toString(), { continued: true, width: 100, align: "center" });
//       doc.fillColor(gradeColor(r.Grade)).text(r.Grade, { align: "center" });
//       doc.fillColor("black");
//     });

//     doc.end();
//   } catch (error) {
//     console.error("Server error:", error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });










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
