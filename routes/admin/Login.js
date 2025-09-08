import express from "express";
import db from "../../middlewares/db.js";
import generateToken from "../../middlewares/admintoken.js";

const router = express.Router();

// url: https://manfess-backend.onrender.com/api/adminlogin
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM admins WHERE Name = ? AND Password = ?",
      [username, password]
    );

    if (results.length > 0) {
      const token = generateToken(results[0].id);
      console.log("Generated token:", token);

      return res.status(200).json({
        message: "Login successful",
        admin: results[0],
        token,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Database query error:", error.message);
    return res.status(500).json({ error: "Database query error" });
  }
});

export default router;
