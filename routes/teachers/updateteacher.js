// import express from 'express';
// import db from "../../middlewares/db.js"

// const router = express.Router();

// // url: /api/teachers/updateteacher
// router.post("/", async(req, res) => {
//     const { Name, Number, localid } = req.body;

//     // Validate input
//     if (!Name || !Number || !localid) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     // Update teacher in the database
//     const query = `
//         UPDATE teachers
//         SET Name = ?, Number = ?
//         WHERE localid = ?
//     `;
//     db.query(query, [Name, Number, localid], (err, result) => {
//         if (err) {
//             console.error("Error updating teacher:", err);
//             return res.status(500).json({ error: "Database error" });
//         }
//         res.json({ message: "Teacher updated successfully" });
//     });
// });

// export default router;












import express from 'express';
import db from '../../middlewares/db.js';

const router = express.Router();

// url: /api/teachers/updateteacher
router.post('/', async (req, res) => {
  const { Name, Number, localid } = req.body;

  // Validate input
  if (!Name || !Number || !localid) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = `
      UPDATE teachers
      SET Name = ?, Number = ?
      WHERE localid = ?
    `;
    const [result] = await db.query(query, [Name, Number, localid]);

    // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.status(200).json({ message: 'Teacher updated successfully' });
  } catch (err) {
    console.error('Error updating teacher:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
