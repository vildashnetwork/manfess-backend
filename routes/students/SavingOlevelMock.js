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
    let updatedCount = 0;

    for (const item of resultsArray) {
      const { studentname, Class, Subject, Subject_Code, Mark, Grade } = item;

      // Check if record exists
      const checkSql = `
        SELECT id 
        FROM mock_results_olevel
        WHERE studentname = ? AND Subject = ?;
      `;

      const rows = await new Promise((resolve, reject) => {
        db.query(checkSql, [studentname, Subject], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      if (rows.length > 0) {
        // Update existing record
        const updateSql = `
          UPDATE mock_results_olevel
          SET Class = ?, Subject_Code = ?, Mark = ?, Grade = ?
          WHERE studentname = ? AND Subject = ?
        `;

        await new Promise((resolve, reject) => {
          db.query(updateSql, [Class, Subject_Code, Mark, Grade, studentname, Subject], (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });

        updatedCount++;
      } else {
        // Insert new record
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
    }

    res.json({
      message: 'Operation completed',
      insertedCount,
      updatedCount
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
