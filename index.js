import express from "express";
import dotenv from "dotenv";
import connectdb from "./middlewares/db.js";

dotenv.config();
const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Express + MySQL Server is Running...");
});

// Example: fetch users from DB
app.get("/users", (req, res) => {
  db.query("SELECT * FROM admins", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

connectdb().then(()=>{
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
})
})
