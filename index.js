// import express from "express";
// import dotenv from "dotenv";
// import db from "./middlewares/db.js";
// import admins from './routes/admin/FetchAdmin.js';
// import adminlogin from  "./routes/admin/Login.js";
// import me from "./routes/admin/me.js";
// import teachers from "./routes/teachers/fetchteachers.js";
// import teachersLogin from "./routes/teachers/teachersLogin.js";
// import subjects from "./routes/subjects/fetchsubjects.js";
// import studentsolevel from "./routes/students/fetchall.js";
// import studentsolevelmock from "./routes/students/SavingOlevelMock.js";
// import alevelfetch from "./routes/students/Alevel/Alevelfetch.js";
// import alevelmock from "./routes/students/Alevel/savAlevelMock.js";
// import premorkalevel from "./routes/students/Premock/Alevel.js";
// import olevelpremock from "./routes/students/Premock/Olevel.js";
// import terminalresults from "./routes/students/TerminalExams.js";
// import allsubjects from "./routes/subjects/all.js";
// import updateteachers from "./routes/teachers/updateteacher.js"
// //middlewares
// dotenv.config();
// const app = express();
// app.use(express.urlencoded({ extended: true })); 
// app.use(express.json())

// //routes
// app.use("/api/teachers/updateteacher", updateteachers)
// app.use("/api/subjects/all", allsubjects)
// app.use("/api", terminalresults)
// app.use("/api/students/olevelpremock", olevelpremock)
// app.use("/api/students/alevelpremock", premorkalevel)
// app.use("/api/students/alevelmock", alevelmock)
// app.use("/api/students/alevel", alevelfetch)
// app.use("/api/students/olevelmock", studentsolevelmock)
// app.use("/api/students", studentsolevel)
// app.use("/api/subjects", subjects)
// app.use("/api/teachers/login", teachersLogin)
// app.use("/api/teachers", teachers)
// app.use('/api/admin/me', me)
// app.use('/api/admin',admins)
// app.use('/api/adminlogin', adminlogin)
// app.use(express.json());



// const PORT = 6500;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`✅ Server running on port http://localhost:${PORT}`);
// })

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import db from "./middlewares/db.js";

// Import your existing routes
import admins from './routes/admin/FetchAdmin.js';
import adminlogin from "./routes/admin/Login.js";
import me from "./routes/admin/me.js";
import teachers from "./routes/teachers/fetchteachers.js";
import teachersLogin from "./routes/teachers/teachersLogin.js";
import subjects from "./routes/subjects/fetchsubjects.js";
import studentsolevel from "./routes/students/fetchall.js";
import studentsolevelmock from "./routes/students/SavingOlevelMock.js";
import alevelfetch from "./routes/students/Alevel/Alevelfetch.js";
import alevelmock from "./routes/students/Alevel/savAlevelMock.js";
import premorkalevel from "./routes/students/Premock/Alevel.js";
import olevelpremock from "./routes/students/Premock/Olevel.js";
import terminalresults from "./routes/students/TerminalExams.js";
import allsubjects from "./routes/subjects/all.js";
import updateteachers from "./routes/teachers/updateteacher.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------------------
// Socket.IO connection
// ----------------------------
io.on("connection", (socket) => {
  console.log("Mobile client connected:", socket.id);
});

// ----------------------------
// Notification routes
// ----------------------------
const notificationRouter = express.Router();

// Admin: push notification
notificationRouter.post("/admin/notifications", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  db.query("INSERT INTO notifications (message, createdAt) VALUES (?, NOW())", [message])
    .then(([result]) => {
      const notification = {
        id: result.insertId,
        message,
        createdAt: new Date()
      };

      // Emit to all connected clients
      io.emit("notification", notification);

      res.json({ success: true, notification });
    })
    .catch(err => {
      console.error("Error pushing notification:", err);
      res.status(500).json({ error: "Server error" });
    });
});

// Get all notifications
notificationRouter.get("/notifications", (req, res) => {
  db.query("SELECT * FROM notifications ORDER BY createdAt DESC")
    .then(([rows]) => res.json(rows))
    .catch(err => {
      console.error("Error fetching notifications:", err);
      res.status(500).json({ error: "Server error" });
    });
});

app.use("/api", notificationRouter);

// ----------------------------
// Existing routes
// ----------------------------
app.use("/api/teachers/updateteacher", updateteachers);
app.use("/api/subjects/all", allsubjects);
app.use("/api", terminalresults);
app.use("/api/students/olevelpremock", olevelpremock);
app.use("/api/students/alevelpremock", premorkalevel);
app.use("/api/students/alevelmock", alevelmock);
app.use("/api/students/alevel", alevelfetch);
app.use("/api/students/olevelmock", studentsolevelmock);
app.use("/api/students", studentsolevel);
app.use("/api/subjects", subjects);
app.use("/api/teachers/login", teachersLogin);
app.use("/api/teachers", teachers);
app.use("/api/admin/me", me);
app.use("/api/admin", admins);
app.use("/api/adminlogin", adminlogin);

// ----------------------------
// Start server
// ----------------------------
const PORT = 6500;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
