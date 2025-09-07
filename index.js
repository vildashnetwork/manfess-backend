import express from "express";
import dotenv from "dotenv";
import db from "./middlewares/db.js";
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
//middlewares
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true })); 
app.use(express.json())

//routes
app.use("/api/subjects/all", allsubjects)
app.use("/api", terminalresults)
app.use("/api/students/olevelpremock", olevelpremock)
app.use("/api/students/alevelpremock", premorkalevel)
app.use("/api/students/alevelmock", alevelmock)
app.use("/api/students/alevel", alevelfetch)
app.use("/api/students/olevelmock", studentsolevelmock)
app.use("/api/students", studentsolevel)
app.use("/api/subjects", subjects)
app.use("/api/teachers/login", teachersLogin)
app.use("/api/teachers", teachers)
app.use('/api/admin/me', me)
app.use('/api/admin',admins)
app.use('/api/adminlogin', adminlogin)
app.use(express.json());



const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Server running on port http://localhost:${PORT}`);
})

