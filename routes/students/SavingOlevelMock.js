import express from 'express';
import db from '../../middlewares/db.js'; 

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/students/olevelmock
router.post('/', async (req, res) => {
  try {
    const data = req.body; // Accepts an object or an array of objects

    // Normalize to array
    const resultsArray = Array.isArray(data) ? data : [data];

    // Prepare values for bulk insert
    const values = resultsArray.map(item => [
      item.studentname,
      item.Class,
      item.Subject,
      item.Subject_Code,
      item.Mark,
      item.Grade
    ]);

    const sql = 'INSERT INTO mock_results_olevel (studentname, Class, Subject, Subject_Code, Mark, Grade) VALUES ?';

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error('Error inserting mock results:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        message: 'Mock results inserted successfully',
        insertedCount: result.affectedRows
      });
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
