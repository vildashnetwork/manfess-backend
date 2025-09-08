// import express from 'express';
// import db from '../../../middlewares/db.js';

// const router = express.Router();

// // url: https://manfess-backend.onrender.com/api/students/olevelpremock
// router.post('/', async (req, res) => {
//   try {
//     const data = req.body; // Accepts an object or an array of objects

//     // Normalize to array
//     const resultsArray = Array.isArray(data) ? data : [data];

//     let insertedCount = 0;
//     let updatedCount = 0;

//     for (const item of resultsArray) {
//       const { studentname, Class, Subject, Subject_Code, Mark, Grade } = item;

//       // Check if record exists
//       const [rows] = await db
//         .promise()
//         .query(
//           `SELECT id FROM premock_results_olevel WHERE studentname = ? AND Subject = ?`,
//           [studentname, Subject]
//         );

//       if (rows.length > 0) {
//         // Update existing record
//         await db
//           .promise()
//           .query(
//             `UPDATE premock_results_olevel
//              SET Class = ?, Subject_Code = ?, Mark = ?, Grade = ?
//              WHERE studentname = ? AND Subject = ?`,
//             [Class, Subject_Code, Mark, Grade, studentname, Subject]
//           );
//         updatedCount++;
//       } else {
//         // Insert new record
//         await db
//           .promise()
//           .query(
//             `INSERT INTO premock_results_olevel (studentname, Class, Subject, Subject_Code, Mark, Grade) 
//              VALUES (?, ?, ?, ?, ?, ?)`,
//             [studentname, Class, Subject, Subject_Code, Mark, Grade]
//           );
//         insertedCount++;
//       }
//     }

//     res.json({
//       message: 'Operation completed',
//       insertedCount,
//       updatedCount
//     });
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// export default router;






import express from 'express';
import db from '../../../middlewares/db.js';

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/students/olevelpremock
router.post('/', async (req, res) => {
  try {
    const data = req.body; // Accepts an object or an array of objects
    const resultsArray = Array.isArray(data) ? data : [data];

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of resultsArray) {
      const { studentname, Class, Subject, Subject_Code, Mark, Grade } = item;

      // Check if record exists
      const [rows] = await db.query(
        `SELECT id FROM premock_results_olevel WHERE studentname = ? AND Subject = ?`,
        [studentname, Subject]
      );

      if (rows.length > 0) {
        // Update existing record
        await db.query(
          `UPDATE premock_results_olevel
           SET Class = ?, Subject_Code = ?, Mark = ?, Grade = ?
           WHERE studentname = ? AND Subject = ?`,
          [Class, Subject_Code, Mark, Grade, studentname, Subject]
        );
        updatedCount++;
      } else {
        // Insert new record
        await db.query(
          `INSERT INTO premock_results_olevel (studentname, Class, Subject, Subject_Code, Mark, Grade)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [studentname, Class, Subject, Subject_Code, Mark, Grade]
        );
        insertedCount++;
      }
    }

    res.status(200).json({
      message: 'Operation completed',
      insertedCount,
      updatedCount
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
//https://manfess-backend.onrender.com/api/students/olevelpremock/all
router.get("/all", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM premock_results_olevel`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
