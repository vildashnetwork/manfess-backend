import express from "express";
import dotenv from "dotenv";
import db from "./middlewares/db.js";
import admins from './routes/Admin.js'
dotenv.config();
const app = express();

app.use('/api/admin',admins)
app.use(express.json());



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port http://localhost:${PORT}`);
})

