import db from "../../middlewares/db.js";
import e from "express";
import jwt from "jsonwebtoken";

const router = e.Router();

router.post("/", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admins WHERE Name = ? AND Password = ?", [username, password], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });

      }
      if (results.length > 0) {
        res.status(200).json({ message: "Login successful", admin: results[0] });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
});
export default router