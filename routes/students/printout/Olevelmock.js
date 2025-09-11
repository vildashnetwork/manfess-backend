

// import express from "express";
// import puppeteer from "puppeteer";
// import db from "../../../middlewares/db.js";
// import fs from "fs";
// import path from "path";

// const router = express.Router();

// const safeString = (val) => (val === null || val === undefined ? "" : String(val).trim());

// const logoPath = path.join(process.cwd(), "public", "logo.png");
// const logoBase64 = fs.existsSync(logoPath)
//   ? `data:image/png;base64,${fs.readFileSync(logoPath, { encoding: "base64" })}`
//   : "";


// router.get("/", async (req, res) => {
//   try {
//     const sequence = req.query.sequence || null;

//     const sql = `
//       SELECT studentname, Class, Subject, Grade
//       FROM mock_results_olevel
//       ${sequence ? "WHERE sequence = ?" : ""}
//       ORDER BY studentname, Subject;
//     `;
//     const params = sequence ? [sequence] : [];
//     const [rows] = await db.query(sql, params);

//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ ok: false, message: "No results found." });
//     }

//     const students = [];
//     const subjects = [];
//     const results = {};

//     rows.forEach(r => {
//       const student = r.studentname;
//       const subject = r.Subject;
//       const grade = r.Grade;

//       if (!students.includes(student)) students.push(student);
//       if (!subjects.includes(subject)) subjects.push(subject);

//       results[student] = results[student] || {};
//       results[student][subject] = grade;
//     });

//     const tableHead = `
//       <tr>
//         <th>STUDENTS</th>
//         ${subjects.map(s => `<th>${s}</th>`).join("")}
//         <th>Passed Subjects</th>
//       </tr>
//     `;

//     const tableBody = students.map(student => {
//       const passedCount = subjects.reduce((count, subj) => {
//         const grade = results[student][subj] || "";
//         return ["A", "B", "C"].includes(grade.toUpperCase()) ? count + 1 : count;
//       }, 0);

//       return `
//         <tr>
//           <td class="student">${student}</td>
//           ${subjects.map(subj => {
//             const grade = results[student][subj] || "";
//             const isPass = ["A", "B", "C"].includes(grade.toUpperCase());
//             return `<td class="${isPass ? "pass" : "fail"}">${grade}</td>`;
//           }).join("")}
//           <td class="passed-count">${passedCount}</td>
//         </tr>
//       `;
//     }).join("");

//     const html = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <title>GENERAL MOCK O'LEVEL RESULTS</title>
//       <style>
//         body { font-family: "Times New Roman", serif; margin: 10px; }
        
//         /* Header */
//         .header { width: 100%; margin-bottom: 20px; border-bottom: 3px solid #005566; }
//         .top-banner { background: #005566; color: #fff; padding: 5px 10px; text-align: center; font-weight: bold; letter-spacing: 1px; font-size: 12px; }
//         .header-content { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
//         .logo { max-height: 80px; }
//         .school-name { text-align: center; flex: 1; font-size: 20px; font-weight: bold; color: #005566; text-transform: uppercase; }
//         .sequence-info { text-align: right; font-size: 12px; color: #333; }
//         .school-details { margin-top: 10px; border: 1px solid #005566; padding: 8px; font-size: 10px; line-height: 1.4; border-radius: 5px; background: #f0f8ff; }
        
//         h1 { text-align: center; margin: 15px 0; text-transform: uppercase; font-size: 16px; color: #005566; }

//         /* Table */
//         table { width: 100%; border-collapse: collapse; font-size: 10px; }
//         th, td { border: 1px solid #000; padding: 5px; text-align: center; }
//         th { background: #f4f4f4; }
//         .student { text-align: left; font-weight: bold; }
//         .pass { color: green; font-weight: bold; }
//         .fail { color: red; font-weight: bold; }
//         .passed-count { font-weight: bold; color: blue; }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <div class="top-banner"> MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS) - GENERAL MOCK O'LEVEL RESULTS</div>
//         <div class="header-content">
//           <img src="${logoBase64}" class="logo" alt="School Logo">
//           <div class="school-name"> MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)</div>
//           <div class="sequence-info">${sequence ? sequence : ""}</div>
//         </div>
//         <div class="school-details">
//           LOCATED AT 200 METERS FROM RAIL OPPOSITE ROYAL CITY, RAIL - BONABERI – DOUALA - CAMEROON. <br>
//           Tel: 682 55 35 03 / 673 037 555 / 677 517 606 <br>
//           AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023 <br>
//           AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024
//         </div>
//       </div>

//       <h1>GENERAL MOCK O'LEVEL RESULTS ${sequence ? "- " + sequence : ""}</h1>

//       <table>
//         <thead>${tableHead}</thead>
//         <tbody>${tableBody}</tbody>
//       </table>
//     </body>
//     </html>
//     `;

//     const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       landscape: true,
//       printBackground: true,
//       margin: { top: "15mm", bottom: "15mm", left: "10mm", right: "10mm" },
//     });

//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "inline; filename=mock_results.pdf");
//     res.send(pdfBuffer);

//   } catch (err) {
//     console.error("Puppeteer PDF error:", err);
//     res.status(500).json({ ok: false, message: err.message });
//   }
// });







// // router.get("/print-slips", async (req, res) => {
// //   try {
// //     // Fetch all students
// //     const [students] = await db.query(
// //       "SELECT DISTINCT studentname, Class, id FROM mock_results_olevel ORDER BY studentname"
// //     );

// //     if (students.length === 0) {
// //       return res.status(404).send("No students found.");
// //     }

// //     // Fetch all subjects grouped by student
// //     const [allResults] = await db.query(
// //       "SELECT id, studentname, Subject, Subject_Code, Mark, Grade FROM mock_results_olevel ORDER BY studentname, Subject"
// //     );

// //     // Group results by student
// //     const resultsByStudent = {};
// //     allResults.forEach(r => {
// //       if (!resultsByStudent[r.id]) resultsByStudent[r.id] = [];
// //       resultsByStudent[r.id].push(r);
// //     });

// //     // Build HTML with page-breaks per student
// //     const slipsHtml = students.map(student => {
// //       const subjects = resultsByStudent[student.id] || [];
// //       return `
// //         <div class="slip">
// //           <div class="header">
// //             <img src="https://via.placeholder.com/80" alt="School Logo">
// //             <h2>GENERAL MOCK O'LEVEL RESULTS</h2>
// //             <p>LOCATED AT BELMON BILINGUAL HIGH SCHOOL, 200 METERS FROM RAIL OPPOSITE ROYAL CITY,<br>
// //             RAIL - BONABERI – DOUALA - CAMEROON.<br>
// //             Tel. 682 55 35 03 / 673 037 555 / 677 517 606</p>
// //             <p>AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023</p>
// //             <p>AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024</p>
// //             <h3>Student Result Slip</h3>
// //           </div>

// //           <div class="student-info">
// //             <p><b>Student Name:</b> ${student.studentname}</p>
// //             <p><b>Class:</b> ${student.Class}</p>
// //           </div>

// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>Subject</th>
// //                 <th>Code</th>
// //                 <th>Mark</th>
// //                 <th>Grade</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${subjects.map(s => `
// //                 <tr>
// //                   <td>${s.Subject}</td>
// //                   <td>${s.Subject_Code}</td>
// //                   <td>${s.Mark}</td>
// //                   <td>${s.Grade}</td>
// //                 </tr>
// //               `).join("")}
// //             </tbody>
// //           </table>
// //         </div>
// //         <div class="page-break"></div>
// //       `;
// //     }).join("");

// //     const html = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <meta charset="UTF-8">
// //         <title>All Students Result Slips</title>
// //         <style>
// //           body { font-family: 'Times New Roman', serif; margin: 40px; padding: 20px; }
// //           .header { text-align: center; margin-bottom: 20px; }
// //           .header img { height: 80px; }
// //           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
// //           table, th, td { border: 1px solid black; }
// //           th, td { padding: 8px; text-align: center; }
// //           th { background: #f2f2f2; }
// //           .student-info { margin-top: 20px; }
// //           .page-break { page-break-after: always; }
// //         </style>
// //       </head>
// //       <body>
// //         ${slipsHtml}
// //       </body>
// //       </html>
// //     `;

// //     // Puppeteer generate multi-page PDF
// //     const browser = await puppeteer.launch({
// //       headless: "new",
// //       args: ["--no-sandbox", "--disable-setuid-sandbox"]
// //     });
// //     const page = await browser.newPage();
// //     await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
// //     const pdfBuffer = await page.pdf({
// //       format: "A4",
// //       printBackground: true,
// //       margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
// //     });
// //     await browser.close();

// //     // Send PDF
// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader("Content-Disposition", `inline; filename=all-students-slips.pdf`);
// //     res.send(pdfBuffer);

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send("Error generating slips");
// //   }
// // });

// // router.get("/print-slips", async (req, res) => {
// //   try {
// //     // Fetch all students
// //     const [students] = await db.query(
// //       "SELECT DISTINCT studentname, Class FROM mock_results_olevel ORDER BY studentname"
// //     );

// //     if (!students.length) return res.status(404).send("No students found.");

// //     // Fetch all results
// //     const [allResults] = await db.query(
// //       "SELECT studentname, Subject, Subject_Code, Mark, Grade FROM mock_results_olevel ORDER BY studentname, Subject"
// //     );

// //     // Group results by student name
// //     const resultsByStudent = {};
// //     allResults.forEach(r => {
// //       if (!resultsByStudent[r.studentname]) resultsByStudent[r.studentname] = [];
// //       resultsByStudent[r.studentname].push(r);
// //     });

// //     // Build HTML slips
// //     const slipsHtml = students.map(student => {
// //       const subjects = resultsByStudent[student.studentname] || [];
// //       return `
// //         <div class="slip">
// //           <div class="header">
// //             <img src="https://via.placeholder.com/100" alt="School Logo">
// //             <h1>Belmon Bilingual High School</h1>
// //             <h2>GENERAL MOCK O'LEVEL RESULTS</h2>
// //             <p>LOCATED AT BELMON BILINGUAL HIGH SCHOOL, 200 METERS FROM RAIL OPPOSITE ROYAL CITY,<br>
// //             RAIL - BONABERI – DOUALA - CAMEROON.<br>
// //             Tel. 682 55 35 03 / 673 037 555 / 677 517 606</p>
// //             <p>AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023</p>
// //             <p>AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024</p>
// //             <h3>Student Result Slip</h3>
// //           </div>

// //           <div class="student-info">
// //             <p><b>Student Name:</b> ${student.studentname}</p>
// //             <p><b>Class:</b> ${student.Class}</p>
// //           </div>

// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>Subject</th>
// //                 <th>Code</th>
// //                 <th>Mark</th>
// //                 <th>Grade</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${subjects.map((s, i) => `
// //                 <tr style="background-color:${i % 2 === 0 ? '#f9f9f9' : '#ffffff'}">
// //                   <td>${s.Subject}</td>
// //                   <td>${s.Subject_Code}</td>
// //                   <td>${s.Mark}</td>
// //                   <td>${s.Grade}</td>
// //                 </tr>
// //               `).join('')}
// //             </tbody>
// //           </table>

// //           <div class="footer">
// //             <p>__________________________ &nbsp;&nbsp; Principal's Signature</p>
// //           </div>
// //         </div>
// //         <div class="page-break"></div>
// //       `;
// //     }).join("");

// //     // Full HTML template
// //     const html = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <meta charset="UTF-8">
// //         <title>All Students Result Slips</title>
// //         <style>
// //           body { font-family: 'Times New Roman', serif; margin: 30px; }
// //           .slip { border: 2px solid #000; padding: 20px; margin-bottom: 30px; }
// //           .header { text-align: center; margin-bottom: 20px; }
// //           .header img { height: 100px; }
// //           h1 { margin-bottom: 5px; font-size: 24px; color: #003366; }
// //           h2 { margin-bottom: 5px; font-size: 20px; color: #0055aa; }
// //           h3 { margin-top: 10px; color: #444; }
// //           .student-info { margin: 20px 0; font-size: 16px; }
// //           table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
// //           table, th, td { border: 1px solid #000; }
// //           th { background: #003366; color: #fff; padding: 10px; }
// //           td { padding: 8px; text-align: center; }
// //           .page-break { page-break-after: always; }
// //           .footer { margin-top: 30px; text-align: left; font-size: 14px; }
// //         </style>
// //       </head>
// //       <body>
// //         ${slipsHtml}
// //       </body>
// //       </html>
// //     `;

// //     // Puppeteer PDF generation
// //     const browser = await puppeteer.launch({
// //       headless: "new",
// //       args: ["--no-sandbox", "--disable-setuid-sandbox"]
// //     });
// //     const page = await browser.newPage();
// //     await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
// //     const pdfBuffer = await page.pdf({
// //       format: "A4",
// //       printBackground: true,
// //       margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
// //     });
// //     await browser.close();

// //     // Send PDF
// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader("Content-Disposition", `inline; filename=all-students-slips.pdf`);
// //     res.send(pdfBuffer);

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send("Error generating slips");
// //   }
// // });



// // router.get("/print-slips", async (req, res) => {
// //   try {
// //     // Fetch all students
// //     const [students] = await db.query(
// //       "SELECT DISTINCT studentname, Class, id FROM mock_results_olevel ORDER BY studentname"
// //     );

// //     if (students.length === 0) {
// //       return res.status(404).send("No students found.");
// //     }

// //     // Fetch all subjects grouped by student
// //     const [allResults] = await db.query(
// //       "SELECT id, studentname, Subject, Subject_Code, Mark, Grade FROM mock_results_olevel ORDER BY studentname, Subject"
// //     );

// //     // Group results by student
// //     const resultsByStudent = {};
// //     allResults.forEach(r => {
// //       if (!resultsByStudent[r.id]) resultsByStudent[r.id] = [];
// //       resultsByStudent[r.id].push(r);
// //     });

// //     // Build HTML with page-breaks per student
// //     const slipsHtml = students.map(student => {
// //       const subjects = resultsByStudent[student.id] || [];
// //       return `
// //         <div class="slip">
// //           <div class="header">
// //             <img src="https://via.placeholder.com/100" alt="School Logo" class="logo">
// //             <h1>GENERAL MOCK O'LEVEL RESULTS</h1>
// //             <p class="school-info">
// //               BELMON BILINGUAL HIGH SCHOOL<br>
// //               200 Meters from Rail Opposite Royal City, Rail - Bonaberi, Douala, Cameroon<br>
// //               Tel: (+237) 682 55 35 03 / 673 037 555 / 677 517 606
// //             </p>
// //             <p class="auth-info">
// //               AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023<br>
// //               AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024
// //             </p>
// //             <h2>Student Result Slip</h2>
// //           </div>

// //           <div class="student-info">
// //             <div class="info-box">
// //               <span class="label">Student Name:</span> <span class="value">${student.studentname}</span>
// //             </div>
// //             <div class="info-box">
// //               <span class="label">Class:</span> <span class="value">${student.Class}</span>
// //             </div>
// //           </div>

// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>Subject</th>
// //                 <th>Code</th>
// //                 <th>Mark</th>
// //                 <th>Grade</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${subjects.map(s => `
// //                 <tr>
// //                   <td>${s.Subject}</td>
// //                   <td>${s.Subject_Code}</td>
// //                   <td>${s.Mark}</td>
// //                   <td>${s.Grade}</td>
// //                 </tr>
// //               `).join("")}
// //             </tbody>
// //           </table>

// //           <div class="footer">
// //             <p>Issued by Belmon Bilingual High School</p>
// //             <p class="watermark">Official Document</p>
// //           </div>
// //         </div>
// //         <div class="page-break"></div>
// //       `;
// //     }).join("");

// //     const html = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <meta charset="UTF-8">
// //         <title>All Students Result Slips</title>
// //         <style>
// //           body {
// //             font-family: 'Roboto', 'Arial', sans-serif;
// //             margin: 0;
// //             padding: 30px;
// //             background-color: #f5f6fa;
// //             color: #333;
// //           }
// //           .slip {
// //             background: #fff;
// //             border-radius: 10px;
// //             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
// //             padding: 20px;
// //             margin-bottom: 30px;
// //             max-width: 700px;
// //             margin-left: auto;
// //             margin-right: auto;
// //             position: relative;
// //             overflow: hidden;
// //           }
// //           .header {
// //             text-align: center;
// //             border-bottom: 2px solid #005566;
// //             padding-bottom: 15px;
// //             margin-bottom: 20px;
// //           }
// //           .header .logo {
// //             height: 100px;
// //             margin-bottom: 10px;
// //           }
// //           .header h1 {
// //             font-size: 24px;
// //             color: #005566;
// //             margin: 10px 0;
// //             font-weight: 700;
// //             text-transform: uppercase;
// //             letter-spacing: 1px;
// //           }
// //           .header h2 {
// //             font-size: 18px;
// //             color: #333;
// //             font-weight: 500;
// //             margin-top: 10px;
// //           }
// //           .school-info, .auth-info {
// //             font-size: 12px;
// //             color: #555;
// //             line-height: 1.4;
// //             margin: 5px 0;
// //           }
// //           .student-info {
// //             display: flex;
// //             flex-wrap: wrap;
// //             gap: 20px;
// //             margin: 20px 0;
// //             background: #f8f9fd;
// //             padding: 15px;
// //             border-radius: 8px;
// //           }
// //           .info-box {
// //             flex: 1;
// //             min-width: 200px;
// //           }
// //           .info-box .label {
// //             font-weight: 600;
// //             color: #005566;
// //             display: inline-block;
// //             width: 120px;
// //           }
// //           .info-box .value {
// //             font-weight: 400;
// //             color: #333;
// //           }
// //           table {
// //             width: 100%;
// //             border-collapse: collapse;
// //             margin-top: 20px;
// //             font-size: 14px;
// //           }
// //           th, td {
// //             border: 1px solid #ddd;
// //             padding: 10px;
// //             text-align: left;
// //           }
// //           th {
// //             background: #005566;
// //             color: #fff;
// //             font-weight: 600;
// //             text-transform: uppercase;
// //             letter-spacing: 0.5px;
// //           }
// //           td {
// //             background: #fff;
// //             color: #333;
// //           }
// //           tr:nth-child(even) td {
// //             background: #f8f9fd;
// //           }
// //           .footer {
// //             text-align: center;
// //             margin-top: 20px;
// //             font-size: 12px;
// //             color: #777;
// //           }
// //           .watermark {
// //             position: absolute;
// //             top: 50%;
// //             left: 50%;
// //             transform: translate(-50%, -50%) rotate(-45deg);
// //             font-size: 40px;
// //             color: rgba(0, 85, 102, 0.1);
// //             pointer-events: none;
// //             text-transform: uppercase;
// //             font-weight: 700;
// //           }
// //           .page-break {
// //             page-break-after: always;
// //           }
// //           @media print {
// //             body {
// //               background: #fff;
// //               margin: 0;
// //             }
// //             .slip {
// //               box-shadow: none;
// //               margin: 0;
// //               max-width: 100%;
// //             }
// //           }
// //         </style>
// //       </head>
// //       <body>
// //         ${slipsHtml}
// //       </body>
// //       </html>
// //     `;

// //     // Puppeteer generate multi-page PDF
// //     const browser = await puppeteer.launch({
// //       headless: "new",
// //       args: ["--no-sandbox", "--disable-setuid-sandbox"]
// //     });
// //     const page = await browser.newPage();
// //     await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
// //     await page.addStyleTag({
// //       content: `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');`
// //     });
// //     const pdfBuffer = await page.pdf({
// //       format: "A4",
// //       printBackground: true,
// //       margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
// //     });
// //     await browser.close();

// //     // Send PDF
// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader("Content-Disposition", `inline; filename=all-students-slips.pdf`);
// //     res.send(pdfBuffer);

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send("Error generating slips");
// //   }
// // });




// // router.get("/print-slips", async (req, res) => {
// //   try {
// //     // Fetch all students
// //     const [students] = await db.query(
// //       "SELECT DISTINCT studentname, Class FROM mock_results_olevel ORDER BY studentname"
// //     );

// //     if (!students.length) return res.status(404).send("No students found.");

// //     // Fetch all results
// //     const [allResults] = await db.query(
// //       "SELECT studentname, Subject, Subject_Code, Mark, Grade FROM mock_results_olevel ORDER BY studentname, Subject"
// //     );

// //     // Group results by student name
// //     const resultsByStudent = {};
// //     allResults.forEach(r => {
// //       if (!resultsByStudent[r.studentname]) resultsByStudent[r.studentname] = [];
// //       resultsByStudent[r.studentname].push(r);
// //     });

// //     // Build HTML slips
// //     const slipsHtml = students.map(student => {
// //       const subjects = resultsByStudent[student.studentname] || [];
// //       return `
// //         <div class="slip">
// //           <div class="header">
// //             <img src="https://manfess-web.vercel.app/assets/logo-BnGfIcdL.png" alt="School Logo" class="logo">
// //             <h1>GENERAL MOCK O'LEVEL RESULTS</h1>
// //             <p class="school-info">
// //               BELMON BILINGUAL HIGH SCHOOL<br>
// //               200 Meters from Rail Opposite Royal City, Rail - Bonaberi, Douala, Cameroon<br>
// //               Tel: (+237) 682 55 35 03 / 673 037 555 / 677 517 606
// //             </p>
// //             <p class="auth-info">
// //               AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023<br>
// //               AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024
// //             </p>
// //             <h2>Student Result Slip</h2>
// //           </div>

// //           <div class="student-info">
// //             <div class="info-box">
// //               <span class="label">Student Name:</span> <span class="value">${student.studentname}</span>
// //             </div>
// //             <div class="info-box">
// //               <span class="label">Class:</span> <span class="value">${student.Class}</span>
// //             </div>
// //           </div>

// //           <table>
// //             <thead>
// //               <tr>
// //                 <th>Subject</th>
// //                 <th>Code</th>
// //                 <th>Mark</th>
// //                 <th>Grade</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               ${subjects.map((s, i) => `
// //                 <tr style="background-color:${i % 2 === 0 ? '#f8f9fd' : '#ffffff'}">
// //                   <td>${s.Subject}</td>
// //                   <td>${s.Subject_Code}</td>
// //                   <td>${s.Mark}</td>
// //                   <td>${s.Grade}</td>
// //                 </tr>
// //               `).join("")}
// //             </tbody>
// //           </table>

// //           <div class="footer">
// //             <p>Issued by Belmon Bilingual High School</p>
// //             <p class="watermark">Official Document</p>
// //           </div>
// //         </div>
// //         <div class="page-break"></div>
// //       `;
// //     }).join("");

// //     // Full HTML template
// //     const html = `
// //       <!DOCTYPE html>
// //       <html>
// //       <head>
// //         <meta charset="UTF-8">
// //         <title>All Students Result Slips</title>
// //         <style>
// //           body {
// //             font-family: 'Roboto', 'Arial', sans-serif;
// //             margin: 0;
// //             padding: 30px;
// //             background-color: #f5f6fa;
// //             color: #333;
// //           }
// //           .slip {
// //             background: #fff;
// //             border-radius: 10px;
// //             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
// //             padding: 20px;
// //             margin-bottom: 30px;
// //             max-width: 700px;
// //             margin-left: auto;
// //             margin-right: auto;
// //             position: relative;
// //             overflow: hidden;
// //           }
// //           .header {
// //             text-align: center;
// //             border-bottom: 2px solid #005566;
// //             padding-bottom: 15px;
// //             margin-bottom: 20px;
// //           }
// //           .header .logo { height: 100px; margin-bottom: 10px; }
// //           .header h1 { font-size: 24px; color: #005566; margin: 10px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
// //           .header h2 { font-size: 18px; color: #333; font-weight: 500; margin-top: 10px; }
// //           .school-info, .auth-info { font-size: 12px; color: #555; line-height: 1.4; margin: 5px 0; }
// //           .student-info { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; background: #f8f9fd; padding: 15px; border-radius: 8px; }
// //           .info-box { flex: 1; min-width: 200px; }
// //           .info-box .label { font-weight: 600; color: #005566; display: inline-block; width: 120px; }
// //           .info-box .value { font-weight: 400; color: #333; }
// //           table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
// //           th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
// //           th { background: #005566; color: #fff; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
// //           td { background: #fff; color: #333; }
// //           tr:nth-child(even) td { background: #f8f9fd; }
// //           .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
// //           .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 40px; color: rgba(0, 85, 102, 0.1); pointer-events: none; text-transform: uppercase; font-weight: 700; }
// //           .page-break { page-break-after: always; }
// //           @media print { body { background: #fff; margin: 0; } .slip { box-shadow: none; margin: 0; max-width: 100%; } }
// //         </style>
// //       </head>
// //       <body>
// //         ${slipsHtml}
// //       </body>
// //       </html>
// //     `;

// //     // Puppeteer generate multi-page PDF
// //     const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
// //     const page = await browser.newPage();
// //     await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
// //     await page.addStyleTag({ content: `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');` });
// //     const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
// //     await browser.close();

// //     // Send PDF
// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader("Content-Disposition", `inline; filename=all-students-slips.pdf`);
// //     res.send(pdfBuffer);

// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send("Error generating slips");
// //   }
// // });





// router.get("/print-slips", async (req, res) => {
//   try {
//     // Fetch all students
//     const [students] = await db.query(
//       "SELECT DISTINCT studentname, Class FROM mock_results_olevel ORDER BY studentname"
//     );

//     if (!students.length) return res.status(404).send("No students found.");

//     // Fetch all results
//     const [allResults] = await db.query(
//       "SELECT studentname, Subject, Subject_Code, Mark, Grade FROM mock_results_olevel ORDER BY studentname, Subject"
//     );

//     // Group results by student name
//     const resultsByStudent = {};
//     allResults.forEach(r => {
//       if (!resultsByStudent[r.studentname]) resultsByStudent[r.studentname] = [];
//       resultsByStudent[r.studentname].push(r);
//     });

//     // Build HTML slips
//     const slipsHtml = students.map(student => {
//       const subjects = resultsByStudent[student.studentname] || [];

//       // Count passed subjects
//       const passedSubjectsCount = subjects.filter(s => ["A", "B", "C", "D"].includes(s.Grade.toUpperCase())).length;

//       return `
//         <div class="slip">
//           <div class="header">
//             <img src="https://manfess-web.vercel.app/assets/logo-BnGfIcdL.png" alt="School Logo" class="logo">
//             <h1> MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS) - GENERAL MOCK O'LEVEL RESULTS</h1>
//             <p class="school-info">
//               MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)<br>
//               200 Meters from Rail Opposite Royal City, Rail - Bonaberi, Douala, Cameroon<br>
//               Tel: (+237) 682 55 35 03 / 673 037 555 / 677 517 606
//             </p>
//             <p class="auth-info">
//               AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023<br>
//               AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024
//             </p>
//             <h2>Student Result Slip</h2>
//           </div>

//           <div class="student-info">
//             <div class="info-box">
//               <span class="label">Student Name:</span> <span class="value" >${student.studentname}</span>
//             </div>
//             <div class="info-box">
//               <span class="label">Class:</span> <span class="value" style="margin-left: -40px;">${student.Class}</span>
//             </div>
//             <div class="info-box">
//               <span class="label" style="width: 100px;">Subjects__Passed:</span> <span class="value" style="margin-left: 40px;"><span style="${passedSubjectsCount<4 ? 'color: red;' : 'color: green;'}">${passedSubjectsCount}</span> OUT OF ${subjects.length} <span style="${passedSubjectsCount<4 ? 'color: red;' : 'color: green;'} margin-left: 40px;">(${passedSubjectsCount<4 ? 'failed' : 'passed'}) </span></span> 
//             </div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th>Subject</th>
//                 <th>Code</th>
//                 <th>Mark</th>
//                 <th>Grade</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${subjects.map((s, i) => {
//                 const isPass = ["A", "B", "C", "D"].includes(s.Grade.toUpperCase());
//                 return `
//                   <tr style="background-color:${i % 2 === 0 ? '#f8f9fd' : '#ffffff'}">
//                     <td>${s.Subject}</td>
//                     <td>${s.Subject_Code}</td>
//                     <td>${s.Mark}</td>
//                     <td style="color:${isPass ? 'green' : 'red'}; font-weight:600;">${s.Grade}</td>
//                   </tr>
//                 `;
//               }).join("")}
//             </tbody>
//           </table>

//           <div class="footer">
//             <p>Issued by  MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS) powered by VILDASH NETWORK</p>
//             <p class="watermark"> MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)</p>
//           </div>
//         </div>
//         <div class="page-break"></div>
//       `;
//     }).join("");

//     // Full HTML template
//     const html = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <title>All Students Result Slips</title>
//         <style>
//           body {
//             font-family: 'Roboto', 'Arial', sans-serif;
//             margin: 0;
//             padding: 30px;
//             background-color: #f5f6fa;
//             color: #333;
//           }
//           .slip {
//             background: #fff;
//             border-radius: 10px;
//             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//             padding: 20px;
//             margin-bottom: 30px;
//             max-width: 700px;
//             margin-left: auto;
//             margin-right: auto;
//             position: relative;
//             overflow: hidden;
//           }
//           .header {
//             text-align: center;
//             border-bottom: 2px solid #005566;
//             padding-bottom: 15px;
//             margin-bottom: 20px;
//           }
//           .header .logo { height: 100px; margin-bottom: 10px; }
//           .header h1 { font-size: 24px; color: #005566; margin: 10px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
//           .header h2 { font-size: 18px; color: #333; font-weight: 500; margin-top: 10px; }
//           .school-info, .auth-info { font-size: 12px; color: #555; line-height: 1.4; margin: 5px 0; }
//           .student-info { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; background: #f8f9fd; padding: 15px; border-radius: 8px; }
//           .info-box { flex: 1; min-width: 200px; }
//           .info-box .label { font-weight: 600; color: #005566; display: inline-block; width: 120px; }
//           .info-box .value { font-weight: 400; color: #333; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
//           th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
//           th { background: #005566; color: #fff; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
//           td { background: #fff; color: #333; }
//           tr:nth-child(even) td { background: #f8f9fd; }
//           .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
//           .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 40px; color: rgba(0, 85, 102, 0.1); pointer-events: none; text-transform: uppercase; font-weight: 700; }
//           .page-break { page-break-after: always; }
//           @media print { body { background: #fff; margin: 0; } .slip { box-shadow: none; margin: 0; max-width: 100%; } }
//         </style>
//       </head>
//       <body>
//         ${slipsHtml}
//       </body>
//       </html>
//     `;

//     // Puppeteer generate multi-page PDF
//     const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
//     await page.addStyleTag({ content: `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');` });
//     const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
//     await browser.close();

//     // Send PDF
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `inline; filename=all-students-slips.pdf`);
//     res.send(pdfBuffer);

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error generating slips");
//   }
// });

// export default router;
















// import express from "express";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import db from "../../../middlewares/db.js";

// const router = express.Router();

// const logoPath = path.join(process.cwd(), "public", "logo.png");
// const logoExists = fs.existsSync(logoPath);

// router.get("/", async (req, res) => {
//   try {
//     const sequence = req.query.sequence || null;

//     const sql = `
//       SELECT studentname, Class, Subject, Grade
//       FROM mock_results_olevel
//       ${sequence ? "WHERE sequence = ?" : ""}
//       ORDER BY studentname, Subject;
//     `;
//     const params = sequence ? [sequence] : [];
//     const [rows] = await db.query(sql, params);

//     if (!rows.length) return res.status(404).send("No results found.");

//     const students = [];
//     const subjects = [];
//     const results = {};

//     rows.forEach(r => {
//       const student = r.studentname;
//       const subject = r.Subject;
//       const grade = r.Grade;

//       if (!students.includes(student)) students.push(student);
//       if (!subjects.includes(subject)) subjects.push(subject);

//       results[student] = results[student] || {};
//       results[student][subject] = grade;
//     });

//     const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 40 });
//     let filename = "mock_results.pdf";
//     filename = encodeURIComponent(filename);

//     res.setHeader("Content-disposition", "inline; filename=" + filename);
//     res.setHeader("Content-type", "application/pdf");

//     doc.pipe(res);

//     // HEADER
//     if (logoExists) doc.image(logoPath, 50, 20, { width: 80 });
//     doc.font("Times-Bold").fontSize(20).fillColor("#005566").text("MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)", 150, 30, { align: "center" });
//     if (sequence) doc.fontSize(12).fillColor("#333").text(`Sequence: ${sequence}`, { align: "right" });

//     doc.moveDown();
//     doc.fontSize(14).fillColor("black").text("GENERAL MOCK O'LEVEL RESULTS", { align: "center" });
//     doc.moveDown(1);

//     // TABLE HEADERS
//     const startX = 50;
//     const startY = 120;
//     const tableTop = startY;
//     const rowHeight = 25;

//     doc.fontSize(10).fillColor("black");
//     doc.text("STUDENTS", startX, tableTop, { width: 100, align: "center" });

//     let currentX = startX + 100;
//     subjects.forEach(subj => {
//       doc.text(subj, currentX, tableTop, { width: 80, align: "center" });
//       currentX += 80;
//     });

//     doc.text("Passed Subjects", currentX, tableTop, { width: 100, align: "center" });

//     // DRAW HEADER LINE
//     doc.moveTo(startX, tableTop + rowHeight - 5).lineTo(currentX + 100, tableTop + rowHeight - 5).stroke();

//     // TABLE ROWS
//     let y = tableTop + rowHeight;
//     students.forEach(student => {
//       const passedCount = subjects.reduce((count, subj) => {
//         const grade = results[student][subj] || "";
//         return ["A", "B", "C"].includes(grade.toUpperCase()) ? count + 1 : count;
//       }, 0);

//       doc.fillColor("black").text(student, startX, y, { width: 100, align: "left" });

//       currentX = startX + 100;
//       subjects.forEach(subj => {
//         const grade = results[student][subj] || "";
//         const isPass = ["A", "B", "C"].includes(grade.toUpperCase());
//         doc.fillColor(isPass ? "green" : "red").text(grade, currentX, y, { width: 80, align: "center" });
//         currentX += 80;
//       });

//       doc.fillColor(passedCount >= 4 ? "green" : "red").text(passedCount, currentX, y, { width: 100, align: "center" });

//       y += rowHeight;

//       // PAGE BREAK
//       if (y > doc.page.height - 50) {
//         doc.addPage({ size: "A4", layout: "landscape", margin: 40 });
//         y = 50;
//       }
//     });

//     doc.end();

//   } catch (err) {
//     console.error("PDFKit error:", err);
//     res.status(500).send(err.message);
//   }
// });


// router.get("/print-slips", async (req, res) => {
//   try {
//     const [students] = await db.query(
//       "SELECT DISTINCT studentname, Class FROM mock_results_olevel ORDER BY studentname"
//     );
//     if (!students.length) return res.status(404).send("No students found.");

//     const [allResults] = await db.query(
//       "SELECT studentname, Subject, Subject_Code, Mark, Grade FROM mock_results_olevel ORDER BY studentname, Subject"
//     );

//     const resultsByStudent = {};
//     allResults.forEach(r => {
//       if (!resultsByStudent[r.studentname]) resultsByStudent[r.studentname] = [];
//       resultsByStudent[r.studentname].push(r);
//     });

//     const doc = new PDFDocument({ size: "A4", margin: 40 });
//     let filename = "all-students-slips.pdf";
//     filename = encodeURIComponent(filename);

//     res.setHeader("Content-disposition", "inline; filename=" + filename);
//     res.setHeader("Content-type", "application/pdf");

//     doc.pipe(res);

//     students.forEach((student, index) => {
//       const subjects = resultsByStudent[student.studentname] || [];
//       const passedSubjectsCount = subjects.filter(s => ["A", "B", "C", "D"].includes(s.Grade.toUpperCase())).length;

//       if (logoExists) doc.image(logoPath, 50, 30, { width: 80 });
//       doc.font("Times-Bold").fontSize(16).fillColor("#005566").text("MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)", 150, 30, { align: "center" });
//       doc.moveDown();
//       doc.fontSize(12).fillColor("black").text("GENERAL MOCK O'LEVEL RESULTS", { align: "center" });
//       doc.moveDown(1);

//       doc.fontSize(12).fillColor("black").text(`Student Name: ${student.studentname}`, { continued: true });
//       doc.text(`   Class: ${student.Class}`, { continued: true });
//       doc.text(`   Passed Subjects: ${passedSubjectsCount} / ${subjects.length}`, { align: "right", fillColor: passedSubjectsCount >= 4 ? "green" : "red" });

//       // SUBJECTS TABLE
//       const startX = 50;
//       let startY = 150;
//       doc.fontSize(10).fillColor("black");
//       doc.text("Subject", startX, startY, { width: 150, align: "center" });
//       doc.text("Code", startX + 150, startY, { width: 100, align: "center" });
//       doc.text("Mark", startX + 250, startY, { width: 80, align: "center" });
//       doc.text("Grade", startX + 330, startY, { width: 80, align: "center" });
//       startY += 20;

//       subjects.forEach(s => {
//         doc.fillColor("black").text(s.Subject, startX, startY, { width: 150, align: "center" });
//         doc.text(s.Subject_Code, startX + 150, startY, { width: 100, align: "center" });
//         doc.text(s.Mark, startX + 250, startY, { width: 80, align: "center" });
//         doc.text(s.Grade, startX + 330, startY, { width: 80, align: "center" });
//         startY += 20;
//       });

//       if (index < students.length - 1) doc.addPage();
//     });

//     doc.end();

//   } catch (err) {
//     console.error("PDFKit slips error:", err);
//     res.status(500).send(err.message);
//   }
// });

// export default router;





















import express from "express";
import PDFDocument from "pdfkit";
import db from "../../../middlewares/db.js";
import fs from "fs";
import path from "path";

const router = express.Router();

const safeString = (val) => (val === null || val === undefined ? "" : String(val).trim());

const logoPath = path.join(process.cwd(), "public", "logo.png");

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

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: {
        top: 42, // ~15mm (approx 42.5 points)
        bottom: 42,
        left: 28, // ~10mm (approx 28.3 points)
        right: 28
      }
    });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=mock_results.pdf");

    // Pipe PDF to response
    doc.pipe(res);

    // Set up fonts
    doc.font("Helvetica");

    // Header section
    // Top banner
    doc.rect(0, 0, doc.page.width, 15)
       .fill("#005566");
    
    doc.fontSize(12)
       .fillColor("#fff")
       .text("MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS) - GENERAL MOCK O'LEVEL RESULTS", 
             doc.page.margins.left, 5, {
               align: "center",
               width: doc.page.width - doc.page.margins.left - doc.page.margins.right
             });

    // Logo and school name
    const logoHeight = 80;
    let currentY = 25;
    
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.margins.left, currentY, { height: logoHeight });
    }
    
    doc.fontSize(20)
       .fillColor("#005566")
       .text("MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)", 
             doc.page.margins.left + (fs.existsSync(logoPath) ? 100 : 0), 
             currentY + 20, {
               align: "center",
               width: doc.page.width - doc.page.margins.left - doc.page.margins.right - (fs.existsSync(logoPath) ? 100 : 0)
             });
    
    if (sequence) {
      doc.fontSize(12)
         .fillColor("#333")
         .text(sequence, 0, currentY + 10, {
           align: "right",
           width: doc.page.width - doc.page.margins.right
         });
    }
    
    currentY += logoHeight + 10;
    
    // School details box
    const detailsText = "LOCATED AT 200 METERS FROM RAIL OPPOSITE ROYAL CITY, RAIL - BONABERI – DOUALA - CAMEROON.\n" +
                       "Tel: 682 55 35 03 / 673 037 555 / 677 517 606\n" +
                       "AUT.Nº: GEN-430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023\n" +
                       "AUT.Nº: TECH-035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024";
    
    doc.rect(doc.page.margins.left, currentY, 
             doc.page.width - doc.page.margins.left - doc.page.margins.right, 50)
       .fill("#f0f8ff")
       .stroke("#005566");
    
    doc.fontSize(10)
       .fillColor("#000")
       .text(detailsText, doc.page.margins.left + 5, currentY + 5, {
         width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 10,
         align: "center",
         lineGap: 3
       });
    
    currentY += 60;
    
    // Title
    const title = `GENERAL MOCK O'LEVEL RESULTS ${sequence ? "- " + sequence : ""}`;
    doc.fontSize(16)
       .fillColor("#005566")
       .text(title, 0, currentY, {
         align: "center",
         width: doc.page.width
       });
    
    currentY += 25;
    
    // Table setup
    const tableTop = currentY;
    const rowHeight = 20;
    const studentColWidth = 150;
    const subjectColWidth = (doc.page.width - doc.page.margins.left - doc.page.margins.right - studentColWidth - 50) / subjects.length;
    const passedColWidth = 50;
    
    // Table headers
    doc.fontSize(10)
       .fillColor("#000")
       .font("Helvetica-Bold");
    
    // Student column
    doc.rect(doc.page.margins.left, tableTop, studentColWidth, rowHeight)
       .fill("#f4f4f4")
       .stroke();
    doc.text("STUDENTS", doc.page.margins.left + 5, tableTop + 5, {
      width: studentColWidth - 10,
      align: "left"
    });
    
    // Subject columns
    subjects.forEach((subject, i) => {
      const x = doc.page.margins.left + studentColWidth + (i * subjectColWidth);
      doc.rect(x, tableTop, subjectColWidth, rowHeight)
         .fill("#f4f4f4")
         .stroke();
      doc.text(subject, x + 5, tableTop + 5, {
        width: subjectColWidth - 10,
        align: "center"
      });
    });
    
    // Passed Subjects column
    const passedX = doc.page.margins.left + studentColWidth + (subjects.length * subjectColWidth);
    doc.rect(passedX, tableTop, passedColWidth, rowHeight)
       .fill("#f4f4f4")
       .stroke();
    doc.text("Passed Subjects", passedX + 5, tableTop + 5, {
      width: passedColWidth - 10,
      align: "center"
    });
    
    // Table rows
    doc.font("Helvetica");
    
    students.forEach((student, rowIndex) => {
      const y = tableTop + ((rowIndex + 1) * rowHeight);
      
      // Student name
      doc.rect(doc.page.margins.left, y, studentColWidth, rowHeight)
         .stroke();
      doc.font("Helvetica-Bold")
         .fillColor("#000")
         .text(student, doc.page.margins.left + 5, y + 5, {
           width: studentColWidth - 10,
           align: "left"
         });
      
      // Calculate passed subjects count
      const passedCount = subjects.reduce((count, subj) => {
        const grade = results[student][subj] || "";
        return ["A", "B", "C"].includes(grade.toUpperCase()) ? count + 1 : count;
      }, 0);
      
      // Subject grades
      subjects.forEach((subject, colIndex) => {
        const x = doc.page.margins.left + studentColWidth + (colIndex * subjectColWidth);
        const grade = results[student][subject] || "";
        const isPass = ["A", "B", "C"].includes(grade.toUpperCase());
        
        doc.rect(x, y, subjectColWidth, rowHeight)
           .stroke();
        
        doc.fillColor(isPass ? "green" : "red")
           .font(isPass ? "Helvetica-Bold" : "Helvetica-Bold")
           .text(grade, x + 5, y + 5, {
             width: subjectColWidth - 10,
             align: "center"
           });
      });
      
      // Passed count
      const passedX = doc.page.margins.left + studentColWidth + (subjects.length * subjectColWidth);
      doc.rect(passedX, y, passedColWidth, rowHeight)
         .stroke();
      doc.fillColor("blue")
         .font("Helvetica-Bold")
         .text(passedCount.toString(), passedX + 5, y + 5, {
           width: passedColWidth - 10,
           align: "center"
         });
    });

    // Finalize PDF
    doc.end();

  } catch (err) {
    console.error("PDFKit PDF error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

export default router;