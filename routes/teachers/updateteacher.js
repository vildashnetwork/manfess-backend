import express from 'express';
import db from "../../middlewares/db.js"

const router = express.Router();

// url: /api/teachers/updateteacher
router.post("/", async(req, res) => {
    const { Name, Number, localid } = req.body;

    // Validate input
    if (!Name || !Number || !localid) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Update teacher in the database
    const query = `
        UPDATE teachers
        SET Name = ?, Number = ?
        WHERE localid = ?
    `;
    db.query(query, [Name, Number, localid], (err, result) => {
        if (err) {
            console.error("Error updating teacher:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Teacher updated successfully" });
    });
});

export default router;