// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import db from '../../middlewares/db.js'


const router = express.Router();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

router.use(bodyParser.json());


// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Mobile client connected:", socket.id);
});

// ----------------------------
// Admin route: push notification
// ----------------------------
router.post("/admin/notifications", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Save message to DB
    const [result] = await db.query("INSERT INTO notifications (message) VALUES (?)", [message]);

    // Emit to all connected clients
    const notification = {
      id: result.insertId,
      message,
      createdAt: new Date()
    };
    io.emit("notification", notification);

    res.json({ success: true, notification });
  } catch (err) {
    console.error("Error pushing notification:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------
// Get all notifications (optional)
// ----------------------------
router.get("/notifications", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM notifications ORDER BY createdAt DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
});

