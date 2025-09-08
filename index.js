import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./middlewares/db.js";

// Routes imports
import admins from './routes/admin/FetchAdmin.js';
import adminlogin from  "./routes/admin/Login.js";
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
import updateteachers from "./routes/teachers/updateteacher.js"
import notification from "./routes/notification/notification.js";
import teacherstimestable from "./routes/teachers/timestable.js"

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/teachers/timetable", teacherstimestable)
app.use("/api/notifications", notification)
app.use("/api/teachers/updateteacher", updateteachers)
app.use("/api/subjects/all", allsubjects)
app.use("/api/students/olevelpremock", olevelpremock)
app.use("/api/students/alevelpremock", premorkalevel)
app.use("/api/students/alevelmock", alevelmock)
app.use("/api/students/alevel", alevelfetch)
app.use("/api/students/olevelmock", studentsolevelmock)
app.use("/api/students", studentsolevel)
app.use("/api/subjects", subjects)
app.use("/api/teachers/login", teachersLogin)
app.use("/api/teachers", teachers)
app.use("/api/admin/me", me)
app.use("/api/admin", admins)
app.use("/api/adminlogin", adminlogin)
app.use("/api", terminalresults)

// Health check
app.get("/api/health", (req, res) => res.json({ status: "Server is running ✅" }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 6500;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
