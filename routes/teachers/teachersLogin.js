import e from "express";
import db from "../../middlewares/db.js";
import jwt from "jsonwebtoken";

const router = e.Router();

//url: https://manfess-backend.onrender.com/api/teachers/login
router.post('/', async (req, res) => {
    const { number, password } = req.body;

    try {
        db.query('SELECT * FROM teachers WHERE Number = ? AND Name = ?', [number, password], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database query error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid number or password' });
            }

            const teacher = results[0];

            // Generate JWT token
            const token = jwt.sign({ id: teacher.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ token, user: teacher });
        });
    } catch (error) {
        console.error('Error logging in teacher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default router;