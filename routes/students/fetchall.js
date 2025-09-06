import e from "express";
import db from "../../middlewares/db.js";
const router = e.Router();

// url: https://manfess-backend.onrender.com/api/students
router.get("/", (req, res) => {
  const q = "SELECT DISTINCT localid, id, FirstName, LastName, level, Department FROM students where level= 'Level 5'";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});


// url: https://manfess-backend.onrender.com/api/students/all

router.get("/all", (req, res) => {
  const q = "SELECT DISTINCT level FROM students";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

export default router;