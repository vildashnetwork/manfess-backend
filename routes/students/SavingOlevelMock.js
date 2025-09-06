import express from 'express';
import db from '../../middlewares/db.js'; 

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/students/olevelmock
router.post('/', async (req, res) => {
  try {
    const data = req.body; // Accepts an object or an array of objects

    // Normalize to array
    const resultsArray = Array.isArray(data) ? data : [data];

    let insertedCount = 0;
    let skipped = [];

    // Loop through each record
    for (const item of resultsArray) {
      const { studentname, Class, Subject, Subject_Code, Mark, Grade } = item;

      // Check for duplicates
      const checkSql = `
        SELECT COUNT(*) AS count
        FROM mock_results_olevel
        WHERE studentname = ? AND Subject = ?;
      `;

      const [rows] = await new Promise((resolve, reject) => {
        db.query(checkSql, [studentname, Subject], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      if (rows.count > 0) {
        // Skip duplicate
        skipped.push({ studentname, Subject });
        continue;
      }

      // Insert new result
      const insertSql = `
        INSERT INTO mock_results_olevel (studentname, Class, Subject, Subject_Code, Mark, Grade)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      await new Promise((resolve, reject) => {
        db.query(insertSql, [studentname, Class, Subject, Subject_Code, Mark, Grade], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      insertedCount++;
    }

    res.json({
      message: 'Insert operation completed',
      insertedCount,
      skippedCount: skipped.length,
      skipped
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
