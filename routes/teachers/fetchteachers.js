import express  from 'express';
import db from '../../middlewares/db.js';

const router = express.Router();

//url: https://manfess-backend.onrender.com/api/teachers
router.get('/', async (req, res) => {
    const query = 'SELECT * FROM teachers';
    try {
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
