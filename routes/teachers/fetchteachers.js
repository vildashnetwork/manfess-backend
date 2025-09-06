import express  from 'express';
import db from '../../middlewares/db.js';

const router = express.Router();

//url: https://manfess-backend.onrender.com/api/teachers
router.get('/', async (req, res) => {
    try {
        db.query('SELECT * FROM teachers', (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
