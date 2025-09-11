

import express from "express";
import puppeteer from "puppeteer";
import db from "../../../middlewares/db.js";
import fs from "fs";
import path from "path";

const router = express.Router();

const safeString = (val) => (val === null || val === undefined ? "" : String(val).trim());

const logoPath = path.join(process.cwd(), "public", "logo.png");
const logoBase64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath, { encoding: "base64" })}`
  : "";


router.get("/", async (req, res) => {
  try {
    const sequence = req.query.sequence || null;

    const sql = `
      SELECT studentname, Class, Subject, Grade
      FROM mock_results_olevel
      ${sequence ? "WHERE sequence = ?" : ""}
      ORDER BY studentname, Subject;
    `;
    const params = sequence ? [sequence] : [];
    const [rows] = await db.query(sql, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ ok: false, message: "No results found." });
    }

    const students = [];
    const subjects = [];
    const results = {};

    rows.forEach(r => {
      const student = r.studentname;
      const subject = r.Subject;
      const grade = r.Grade;

      if (!students.includes(student)) students.push(student);
      if (!subjects.includes(subject)) subjects.push(subject);

      results[student] = results[student] || {};
      results[student][subject] = grade;
    });

    const tableHead = `
      <tr>
        <th>STUDENTS</th>
        ${subjects.map(s => `<th>${s}</th>`).join("")}
        <th>Passed Subjects</th>
      </tr>
    `;

    const tableBody = students.map(student => {
      const passedCount = subjects.reduce((count, subj) => {
        const grade = results[student][subj] || "";
        return ["A", "B", "C"].includes(grade.toUpperCase()) ? count + 1 : count;
      }, 0);

      return `
        <tr>
          <td class="student">${student}</td>
          ${subjects.map(subj => {
            const grade = results[student][subj] || "";
            const isPass = ["A", "B", "C"].includes(grade.toUpperCase());
            return `<td class="${isPass ? "pass" : "fail"}">${grade}</td>`;
          }).join("")}
          <td class="passed-count">${passedCount}</td>
        </tr>
      `;
    }).join("");

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>GENERAL MOCK O'LEVEL RESULTS</title>
      <style>
        body { font-family: "Times New Roman", serif; margin: 10px; }
        
        /* Header */
        .header { width: 100%; margin-bottom: 20px; border-bottom: 3px solid #005566; }
        .top-banner { background: #005566; color: #fff; padding: 5px 10px; text-align: center; font-weight: bold; letter-spacing: 1px; font-size: 12px; }
        .header-content { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .logo { max-height: 80px; }
        .school-name { text-align: center; flex: 1; font-size: 20px; font-weight: bold; color: #005566; text-transform: uppercase; }
        .sequence-info { text-align: right; font-size: 12px; color: #333; }
        .school-details { margin-top: 10px; border: 1px solid #005566; padding: 8px; font-size: 10px; line-height: 1.4; border-radius: 5px; background: #f0f8ff; }
        
        h1 { text-align: center; margin: 15px 0; text-transform: uppercase; font-size: 16px; color: #005566; }

        /* Table */
        table { width: 100%; border-collapse: collapse; font-size: 10px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: center; }
        th { background: #f4f4f4; }
        .student { text-align: left; font-weight: bold; }
        .pass { color: green; font-weight: bold; }
        .fail { color: red; font-weight: bold; }
        .passed-count { font-weight: bold; color: blue; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="top-banner"> MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS) - GENERAL MOCK O'LEVEL RESULTS</div>
        <div class="header-content">
          <img src="${logoBase64}" class="logo" alt="School Logo">
          <div class="school-name"> MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)</div>
          <div class="sequence-info">${sequence ? sequence : ""}</div>
        </div>
        <div class="school-details">
          LOCATED AT 200 METERS FROM RAIL OPPOSITE ROYAL CITY, RAIL - BONABERI – DOUALA - CAMEROON. <br>
          Tel: 682 55 35 03 / 673 037 555 / 677 517 606 <br>
          AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023 <br>
          AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024
        </div>
      </div>

      <h1>GENERAL MOCK O'LEVEL RESULTS ${sequence ? "- " + sequence : ""}</h1>

      <table>
        <thead>${tableHead}</thead>
        <tbody>${tableBody}</tbody>
      </table>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "10mm", right: "10mm" },
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=mock_results.pdf");
    res.send(pdfBuffer);

  } catch (err) {
    console.error("Puppeteer PDF error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});








router.get("/print-slips", async (req, res) => {
  try {
    const [students] = await db.query(
      "SELECT DISTINCT studentname, Class FROM mock_results_olevel ORDER BY studentname"
    );
    if (!students.length) return res.status(404).send("No students found.");

    const [allResults] = await db.query(
      "SELECT studentname, Subject, Subject_Code, Mark, Grade FROM mock_results_olevel ORDER BY studentname, Subject"
    );

    const resultsByStudent = {};
    allResults.forEach(r => {
      if (!resultsByStudent[r.studentname]) resultsByStudent[r.studentname] = [];
      resultsByStudent[r.studentname].push(r);
    });

    const slipsHtml = students.map(student => {
      const subjects = resultsByStudent[student.studentname] || [];
      const passedSubjectsCount = subjects.filter(s => ["A", "B", "C", "D"].includes(s.Grade.toUpperCase())).length;

      return `
        <div class="slip">
          <div class="header">
            <img src="https://manfess-web.vercel.app/assets/logo-BnGfIcdL.png" alt="School Logo" class="logo">
            <h1>MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS) - GENERAL MOCK O'LEVEL RESULTS</h1>
            <p class="school-info">
              MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)<br>
              200 Meters from Rail Opposite Royal City, Rail - Bonaberi, Douala, Cameroon<br>
              Tel: (+237) 682 55 35 03 / 673 037 555 / 677 517 606
            </p>
            <p class="auth-info">
              AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023<br>
              AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024
            </p>
            <h2>Student Result Slip</h2>
          </div>

          <div class="student-info">
            <div class="info-box">
              <span class="label">Student Name:</span> <span class="value">${student.studentname}</span>
            </div>
            <div class="info-box">
              <span class="label">Class:</span> <span class="value">${student.Class}</span>
            </div>
            <div class="info-box">
              <span class="label">Subjects Passed:</span> 
              <span class="value" style="${passedSubjectsCount < 4 ? 'color:red;' : 'color:green;'}">
                ${passedSubjectsCount} OUT OF ${subjects.length} (${passedSubjectsCount < 4 ? 'failed' : 'passed'})
              </span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Mark</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${subjects.map((s, i) => `
                <tr style="background-color:${i % 2 === 0 ? '#f8f9fd' : '#ffffff'}">
                  <td>${s.Subject}</td>
                  <td>${s.Subject_Code}</td>
                  <td>${s.Mark}</td>
                  <td>${s.Grade}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Issued by MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)</p>
            <p class="watermark">Official Document</p>
          </div>
        </div>
        <div class="page-break"></div>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>All Students Result Slips</title>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 30px; background-color: #f5f6fa; color: #333; }
          .slip { background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 30px; max-width: 700px; margin: auto; position: relative; overflow: hidden; }
          .header { text-align: center; border-bottom: 2px solid #005566; padding-bottom: 15px; margin-bottom: 20px; }
          .header .logo { height: 100px; margin-bottom: 10px; }
          .header h1 { font-size: 20px; color: #005566; margin: 10px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .header h2 { font-size: 16px; color: #333; font-weight: 500; margin-top: 10px; }
          .school-info, .auth-info { font-size: 12px; color: #555; line-height: 1.4; margin: 5px 0; }
          .student-info { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; background: #f8f9fd; padding: 15px; border-radius: 8px; }
          .info-box { flex: 1; min-width: 200px; }
          .info-box .label { font-weight: 600; color: #005566; display: inline-block; width: 120px; }
          .info-box .value { font-weight: 400; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
          th { background: #005566; color: #fff; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          tr:nth-child(even) td { background: #f8f9fd; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 40px; color: rgba(0, 85, 102, 0.1); pointer-events: none; text-transform: uppercase; font-weight: 700; }
          .page-break { page-break-after: always; }
          @media print { body { background: #fff; margin: 0; } .slip { box-shadow: none; margin: 0; max-width: 100%; } }
        </style>
      </head>
      <body>
        ${slipsHtml}
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=all-students-slips.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating slips");
  }
});

export default router;
