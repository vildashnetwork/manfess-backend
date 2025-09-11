
import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from "../../../middlewares/db.js";

const router = express.Router();

const safeString = (val) => (val === null || val === undefined ? "" : String(val).trim());

const logoPath = path.join(process.cwd(), "public", "logo.png");
const SCHOOL_NAME = "MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)";
const SCHOOL_ADDRESS = "LOCATED AT 200 METERS FROM RAIL OPPOSITE ROYAL CITY, RAIL - BONABERI – DOUALA - CAMEROON.";
const SCHOOL_CONTACT = "Tel: 682 55 35 03 / 673 037 555 / 677 517 606";
const AUTH_INFO = "AUT.Nº: GEN- 430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023 \nAUT.Nº: TECH - 035/24/MINESEC/SG/DESTP/SDSPETP/SSEPTP/07/FEB/2024";

const PASSING_GRADES = new Set(["A", "B", "C", "A+"]); // adjust if D is considered pass

// ---------- Helpers ----------
function drawWatermark(doc, text, pageWidth, pageHeight) {
  doc.save();
  try {
    doc.fillColor("black", 0.06);
    doc.fontSize(60);
    doc.rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] });
    doc.opacity(0.06);
    doc.text(text, pageWidth / 2 - 200, pageHeight / 2 - 30, { width: 400, align: "center" });
    doc.opacity(1);
  } finally {
    doc.restore();
  }
}

function drawHeaderContents(doc, options = {}) {
  const {
    x = doc.page.margins.left,
    y = doc.page.margins.top,
    width = doc.page.width - doc.page.margins.left - doc.page.margins.right,
    sequence = "",
  } = options;

  const logoW = 70;
  const logoH = 70;
  const leftX = x;
  const rightX = x + width;

  if (fs.existsSync(logoPath)) {
    try {
      doc.image(logoPath, leftX, y, { width: logoW, height: logoH });
    } catch (e) {
      // ignore image errors
    }
  }

  doc.font("Times-Bold").fontSize(14).fillColor("#003f3f");
  doc.text(SCHOOL_NAME, leftX + logoW + 10, y + 6, {
    width: width - logoW - 80,
    align: "center",
  });

  if (sequence) {
    doc.font("Times-Roman").fontSize(9).fillColor("#333");
    doc.text(`Sequence: ${sequence}`, rightX - 100, y + 6, { width: 100, align: "right" });
  }

  const addrY = y + logoH + 8;
  doc.font("Times-Roman").fontSize(9).fillColor("#222");
  // draw address box: fill then text
  doc.save();
  doc.roundedRect(leftX, addrY - 4, width, 56, 4).fillAndStroke("#f0f8ff", "#005566");
  doc.fillColor("#003f3f");
  doc.text(`${SCHOOL_ADDRESS}\n${SCHOOL_CONTACT}\n${AUTH_INFO}`, leftX + 6, addrY + 5, {
    width: width - 12,
    align: "center",
    lineGap: 2,
  });
  doc.restore();

  // Title
  doc.moveDown(1);
  doc.font("Times-Bold").fontSize(12).fillColor("#005566");
  doc.text("GENERAL PREMOCK O'LEVEL RESULTS SLIP", x, addrY + 56, {
    width: width,
    align: "center",
  });

  // return bottom Y (y position after header)
  return addrY + 56 + 12;
}

// Fit text into width by reducing font size (no wrapping)
function drawTextFit(doc, text, x, y, maxWidth, opts = {}) {
  // opts: font (string), baseSize (number), minSize (number), align
  const baseSize = opts.baseSize || 10;
  const minSize = opts.minSize || 6;
  const fontName = opts.font || doc._font.name || "Times-Roman";
  let size = baseSize;
  doc.font(fontName);
  doc.fontSize(size);
  // measure
  let w = doc.widthOfString(text || "");
  while (w > maxWidth && size > minSize) {
    size -= 0.5;
    doc.fontSize(size);
    w = doc.widthOfString(text || "");
  }
  // If still longer, truncate with ellipsis
  if (w > maxWidth) {
    // naive truncate
    let truncated = String(text || "");
    while (doc.widthOfString(truncated + "...") > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    truncated = truncated + "...";
    doc.fontSize(size);
    doc.text(truncated, x, y, { width: maxWidth, align: opts.align || "left" });
  } else {
    doc.fontSize(size);
    doc.text(text || "", x, y, { width: maxWidth, align: opts.align || "left" });
  }
}

// Ensure space on page, add new page + header + table header when needed
function ensureSpace(doc, neededHeight, onNewPage) {
  const bottomLimit = doc.page.height - doc.page.margins.bottom - 40;
  if (doc.y + neededHeight > bottomLimit) {
    doc.addPage();
    const headerBottom = onNewPage(); // draw header and table header as needed
    doc.y = headerBottom + 12;
  }
}


router.get("/", async (req, res) => {
  try {
    const sequence = req.query.sequence || "";

    const sql = `
      SELECT studentname, Class, Subject, Grade
      FROM premock_results_olevel
      ${sequence ? "WHERE sequence = ?" : ""}
      ORDER BY studentname, Subject;
    `;
    const params = sequence ? [sequence] : [];
    const [rows] = await db.query(sql, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ ok: false, message: "No results found." });
    }

    // Build subjects, students, and map
    const students = [];
    const subjects = [];
    const results = {};
    rows.forEach((r) => {
      const student = safeString(r.studentname);
      const subject = safeString(r.Subject);
      const grade = safeString(r.Grade);

      if (!students.includes(student)) students.push(student);
      if (!subjects.includes(subject)) subjects.push(subject);

      results[student] = results[student] || {};
      results[student][subject] = grade;
    });

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 36, bottom: 36, left: 36, right: 36 },
      autoFirstPage: false,
    });

    // stream
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=manfess_preolevel_mock_results.pdf");
    doc.pipe(res);

    doc.addPage();
    doc.font("Times-Roman");

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const usableWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left;

    // Table metrics (compact)
    const headerHeight = 22;
    const rowHeight = 20;
    const passedColWDesired = 80; // fixed width for Passed Subjects column
    const studentColMin = 100; // minimal width for student name column
    const subjectColMin = 45;

    // First compute integer column widths so they sum exactly to usableWidth
    // Start with subjectColW as floor((usable - studentMin - passed)/nSubjects)
    const nSubjects = subjects.length || 1;
    let subjectColW = Math.floor((usableWidth - studentColMin - passedColWDesired) / nSubjects);
    if (subjectColW < subjectColMin) subjectColW = subjectColMin;

    // studentColW attempt
    let studentColW = Math.max(studentColMin, usableWidth - passedColWDesired - subjectColW * nSubjects);

    // recompute residual and distribute to subject cols so sum = usableWidth
    let columns = []; // array of widths: [studentColW, subjW..., passedColW]
    // build subject widths array with integer distribution
    let subjectWidths = new Array(nSubjects).fill(subjectColW);
    // compute current sum and adjust last subject to fill residual
    let currentSum = studentColW + subjectWidths.reduce((a,b) => a+b, 0) + passedColWDesired;
    let residual = usableWidth - currentSum;
    // distribute residual (can be negative if we overshot)
    // We'll add/subtract single pixel to the subject widths (last-first) to make it exact.
    let idx = 0;
    while (residual !== 0) {
      const i = idx % nSubjects;
      subjectWidths[i] += residual > 0 ? 1 : -1;
      residual += residual > 0 ? -1 : 1;
      idx++;
    }

    columns = [studentColW, ...subjectWidths, passedColWDesired];

    // convenience: compute X positions for each column
    const colX = [];
    let cx = startX;
    for (let i = 0; i < columns.length; i++) {
      colX.push(cx);
      cx += columns[i];
    }

    // header drawing helpers
    function drawHeaderForPage() {
      return drawHeaderContents(doc, { x: startX, y: doc.page.margins.top, width: usableWidth, sequence });
    }

    function drawTableHeader() {
      const headerBottom = drawHeaderForPage();
      // push table up (small gap)
      doc.y = headerBottom + 4;

      const yTop = doc.y;
      // draw each header cell as a single rect => joined appearance
      doc.save();
      doc.font("Times-Bold").fontSize(9);
      for (let i = 0; i < columns.length; i++) {
        const w = columns[i];
        const x = colX[i];
        // header background color: darker for first and last maybe
        doc.rect(x, yTop, w, headerHeight).fillAndStroke("#f4f4f4", "#000");
        doc.fillColor("#000");
        if (i === 0) {
          // STUDENTS (left aligned)
          drawTextFit(doc, "STUDENTS", x + 6, yTop + 4, w - 12, { baseSize: 10, minSize: 6, font: "Times-Bold", align: "left" });
        } else if (i === columns.length - 1) {
          // Passed Subjects (center)
          drawTextFit(doc, "Passed Subjects", x + 2, yTop + 4, w - 4, { baseSize: 9, minSize: 6, font: "Times-Bold", align: "center" });
        } else {
          // subject headers centered
          const subjIndex = i - 1;
          drawTextFit(doc, subjects[subjIndex], x + 2, yTop + 4, w - 4, { baseSize: 9, minSize: 6, font: "Times-Bold", align: "center" });
        }
        // stroke cell border to ensure joined full-grid look
        doc.rect(x, yTop, w, headerHeight).stroke();
      }
      doc.restore();

      // move y below header
      doc.y = yTop + headerHeight;
    }

    // initial draw
    drawTableHeader();

    // rows
    let rowIndex = 0;
    for (const student of students) {
      // ensure space (row + small padding); on new page we must redraw header + table header
      ensureSpace(doc, rowHeight + 6, () => { drawHeaderForPage(); drawTableHeader(); return doc.y; });

      const yTop = doc.y;
      // alternating background
      if (rowIndex % 2 === 1) {
        doc.rect(startX, yTop, usableWidth, rowHeight).fill("#fafafa");
      }

      // Draw each cell individually using columns array (keeps them joined)
      for (let ci = 0; ci < columns.length; ci++) {
        const x = colX[ci];
        const w = columns[ci];

        if (ci === 0) {
          // student name
          doc.save();
          doc.fillColor("#000").font("Times-Bold");
          drawTextFit(doc, student, x + 6, yTop + 4, w - 12, { baseSize: 9, minSize: 6, font: "Times-Bold", align: "left" });
          doc.restore();
        } else if (ci === columns.length - 1) {
          // passed subjects
          const passedCount = subjects.reduce((c, subj) => {
            const g = (results[student] && results[student][subj]) ? String(results[student][subj]).toUpperCase() : "";
            return PASSING_GRADES.has(g) ? c + 1 : c;
          }, 0);
          const passedColor = passedCount < 4 ? "red" : "green";
          doc.save();
          doc.fillColor(passedColor).font("Times-Bold");
          drawTextFit(doc, String(passedCount), x + 2, yTop + 4, w - 4, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
          doc.restore();
        } else {
          // subject grade
          const subjIndex = ci - 1;
          const subjName = subjects[subjIndex];
          const grade = (results[student] && results[student][subjName]) ? results[student][subjName] : "";
          const isPass = PASSING_GRADES.has(String(grade).toUpperCase());
          // draw grade centered, then overlay colored bold text for pass/fail
          doc.save();
          drawTextFit(doc, grade, x, yTop + 4, w, { baseSize: 9, minSize: 6, font: "Times-Roman", align: "center" });
          if (grade) {
            doc.fillColor(isPass ? "green" : "red").font("Times-Bold");
            doc.text(grade, x, yTop + 4, { width: w, align: "center" });
          }
          doc.restore();
        }

        // stroke the cell border
        doc.rect(x, yTop, w, rowHeight).stroke();
      }

      // move to next row (compact)
      doc.y = yTop + rowHeight + 2;
      rowIndex++;
    }

    // Footer
    const footerY = pageHeight - doc.page.margins.bottom - 30;
    doc.font("Times-Roman").fontSize(9).fillColor("#444");
    doc.text(`Issued by ${SCHOOL_NAME}`, doc.page.margins.left, footerY, { align: "left" });

    drawWatermark(doc, "MANFESS PREMOCK RESULTS", pageWidth, pageHeight);

    doc.end();
  } catch (err) {
    console.error("PDFKit / error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
});


// ---------- ROUTE 2: /print-slips (per student portrait slips) ----------
// router.get("/print-slips", async (req, res) => {
//   try {
//     const [students] = await db.query("SELECT DISTINCT studentname, Class FROM premock_results_olevel ORDER BY studentname");
//     if (!students.length) return res.status(404).send("No students found.");

//     const [allResults] = await db.query("SELECT studentname, Subject, Subject_Code, Mark, Grade FROM premock_results_olevel ORDER BY studentname, Subject");

//     // Group by studentname
//     const resultsByStudent = {};
//     allResults.forEach((r) => {
//       const name = safeString(r.studentname);
//       resultsByStudent[name] = resultsByStudent[name] || [];
//       resultsByStudent[name].push({
//         Subject: safeString(r.Subject),
//         Subject_Code: safeString(r.Subject_Code),
//         Mark: safeString(r.Mark),
//         Grade: safeString(r.Grade),
//       });
//     });

//     const doc = new PDFDocument({
//       size: "A4",
//       layout: "portrait",
//       margins: { top: 36, bottom: 36, left: 36, right: 36 },
//       autoFirstPage: false,
//     });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "inline; filename=MANFESS_PREMOCKOLEVEL_SLIP_2025/2026.pdf");
//     doc.pipe(res);

//     doc.addPage();
//     doc.font("Times-Roman");

//     const pageWidth = doc.page.width;
//     const pageHeight = doc.page.height;
//     const usableWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;
//     const startX = doc.page.margins.left;

//     function drawHeaderForSlip() {
//       return drawHeaderContents(doc, { x: startX, y: doc.page.margins.top, width: usableWidth, sequence: "" });
//     }

//     let first = true;
//     for (const srow of students) {
//       const name = safeString(srow.studentname);
//       const studentClass = safeString(srow.Class);
//       const subjects = resultsByStudent[name] || [];

//       if (!first) doc.addPage();
//       first = false;

//       const headerBottom = drawHeaderForSlip();
//       doc.y = headerBottom + 12;

//       // student info box
//       const infoBoxH = 52;
//       doc.save();
//       doc.rect(startX, doc.y, usableWidth, infoBoxH).fillAndStroke("#f8f9fd", "#ddd");
//       doc.fillColor("#003f3f").font("Times-Bold").fontSize(10);
//       doc.text("Student Name:", startX + 8, doc.y + 15, { continued: true });
//       doc.font("Times-Roman").text(` ${name}`, { continued: false });

//       doc.font("Times-Bold").text("Class:", startX + usableWidth / 3 + 8, doc.y - 10, { continued: true });
//       doc.font("Times-Roman").text(` ${studentClass}`, { continued: false });

//       const passedCount = subjects.filter(s => PASSING_GRADES.has(String(s.Grade).toUpperCase())).length;
//       const passedColor = passedCount < 4 ? "red" : "green";
//       doc.font("Times-Bold").fillColor(passedColor).text(`Subjects Passed: ${passedCount} / ${subjects.length}`, startX + (usableWidth * 2) / 3 + 8, doc.y - 10, { continued: false });
//       doc.restore();

//       doc.y = doc.y + infoBoxH + 8;

//       // table columns
//       const colSubject = Math.floor(usableWidth * 0.52);
//       const colCode = Math.floor(usableWidth * 0.16);
//       const colMark = Math.floor(usableWidth * 0.16);
//       const colGrade = usableWidth - colSubject - colCode - colMark;
//       const rowH = 20;

//       // table header
//       const yTopHdr = doc.y;
//       doc.save();
//       doc.rect(startX, yTopHdr, usableWidth, rowH).fillAndStroke("#005566", "#000");
//       doc.fillColor("#fff").font("Times-Bold").fontSize(10);
//       drawTextFit(doc, "Subject", startX + 6, yTopHdr + 4, colSubject - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "left" });
//       drawTextFit(doc, "Code", startX + colSubject + 6, yTopHdr + 4, colCode - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
//       drawTextFit(doc, "Mark", startX + colSubject + colCode + 6, yTopHdr + 4, colMark - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
//       drawTextFit(doc, "Grade", startX + colSubject + colCode + colMark + 6, yTopHdr + 4, colGrade - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
//       // stroke columns borders
//       doc.rect(startX, yTopHdr, colSubject, rowH).stroke();
//       doc.rect(startX + colSubject, yTopHdr, colCode, rowH).stroke();
//       doc.rect(startX + colSubject + colCode, yTopHdr, colMark, rowH).stroke();
//       doc.rect(startX + colSubject + colCode + colMark, yTopHdr, colGrade, rowH).stroke();
//       doc.restore();

//       doc.y = yTopHdr + rowH;

//       // rows
//       for (let i = 0; i < subjects.length; i++) {
//         ensureSpace(doc, rowH + 8, () => drawHeaderForSlip());

//         const yTop = doc.y;
//         if (i % 2 === 1) {
//           doc.rect(startX, yTop, usableWidth, rowH).fill("#f8f9fd");
//         }

//         const row = subjects[i];
//         drawTextFit(doc, row.Subject || "-", startX + 6, yTop + 5, colSubject - 8, { baseSize: 10, minSize: 7, font: "Times-Roman", align: "left" });
//         drawTextFit(doc, row.Subject_Code || "-", startX + colSubject + 6, yTop + 5, colCode - 8, { baseSize: 10, minSize: 7, font: "Times-Roman", align: "center" });
//         drawTextFit(doc, row.Mark || "-", startX + colSubject + colCode + 6, yTop + 5, colMark - 8, { baseSize: 10, minSize: 7, font: "Times-Roman", align: "center" });

//         const isPass = PASSING_GRADES.has(String(row.Grade).toUpperCase());
//         doc.fillColor(isPass ? "green" : "red").font("Times-Bold");
//         drawTextFit(doc, row.Grade || "-", startX + colSubject + colCode + colMark + 6, yTop + 5, colGrade - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
//         doc.fillColor("#000");

//         // stroke cell borders
//         doc.rect(startX, yTop, colSubject, rowH).stroke();
//         doc.rect(startX + colSubject, yTop, colCode, rowH).stroke();
//         doc.rect(startX + colSubject + colCode, yTop, colMark, rowH).stroke();
//         doc.rect(startX + colSubject + colCode + colMark, yTop, colGrade, rowH).stroke();

//         doc.y = yTop + rowH;
//       }

//       // page footer for this slip
//       const footerY = pageHeight - doc.page.margins.bottom - 30;
//       doc.font("Times-Roman").fontSize(9).fillColor("#444");
//       doc.text(`Issued by ${SCHOOL_NAME}`, doc.page.margins.left, footerY, { align: "left" });

//       drawWatermark(doc, "MANFESS PREMOCK SLIP", pageWidth, pageHeight);
//       // next student will addPage() above
//     }

//     doc.end();
//   } catch (err) {
//     console.error("print-slips PDF error:", err);
//     return res.status(500).send("Error generating slips");
//   }
// });

router.get("/print-slips", async (req, res) => {
  try {
    const [students] = await db.query(
      "SELECT DISTINCT studentname, Class FROM premock_results_olevel ORDER BY studentname"
    );
    if (!students.length) return res.status(404).send("No students found.");

    const [allResults] = await db.query(
      "SELECT studentname, Subject, Subject_Code, Mark, Grade FROM premock_results_olevel ORDER BY studentname, Subject"
    );

    // Group by studentname
    const resultsByStudent = {};
    allResults.forEach((r) => {
      const name = safeString(r.studentname);
      resultsByStudent[name] = resultsByStudent[name] || [];
      resultsByStudent[name].push({
        Subject: safeString(r.Subject),
        Subject_Code: safeString(r.Subject_Code),
        Mark: safeString(r.Mark),
        Grade: safeString(r.Grade),
      });
    });

    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margins: { top: 36, bottom: 36, left: 36, right: 36 },
      autoFirstPage: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=MANFESS_PREMOCKOLEVEL_SLIP_2025_2026.pdf"
    );
    doc.pipe(res);

    doc.addPage();
    doc.font("Times-Roman");

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const usableWidth =
      pageWidth - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left;

    function drawHeaderForSlip() {
      return drawHeaderContents(doc, {
        x: startX,
        y: doc.page.margins.top,
        width: usableWidth,
        sequence: "",
      });
    }

    let first = true;
    for (const srow of students) {
      const name = safeString(srow.studentname);
      const studentClass = safeString(srow.Class);
      const subjects = resultsByStudent[name] || [];

      if (!first) doc.addPage();
      first = false;

      const headerBottom = drawHeaderForSlip();
      doc.y = headerBottom + 12;

      // student info box
      const infoBoxH = 52;
      doc.save();
      doc.rect(startX, doc.y, usableWidth, infoBoxH).fillAndStroke("#f8f9fd", "#ddd");
      doc.fillColor("#003f3f").font("Times-Bold").fontSize(10);
      doc.text("Student Name:", startX + 8, doc.y + 15, { continued: true });
      doc.font("Times-Roman").text(` ${name}`);

      doc.font("Times-Bold").text("Class:", startX + usableWidth / 3 + 8, doc.y - 10, { continued: true });
      doc.font("Times-Roman").text(` ${studentClass}`);

      const passedCount = subjects.filter((s) =>
        PASSING_GRADES.has(String(s.Grade).toUpperCase())
      ).length;
      const passedColor = passedCount < 4 ? "red" : "green";
      doc.font("Times-Bold")
        .fillColor(passedColor)
        .text(
          `Subjects Passed: ${passedCount} / ${subjects.length}`,
          startX + (usableWidth * 2) / 3 + 8,
          doc.y - 10
        );
      doc.restore();

      doc.y = doc.y + infoBoxH + 8;

      // table columns
      const colSubject = Math.floor(usableWidth * 0.52);
      const colCode = Math.floor(usableWidth * 0.16);
      const colMark = Math.floor(usableWidth * 0.16);
      const colGrade = usableWidth - colSubject - colCode - colMark;
      const rowH = 20;

      // table header
      const yTopHdr = doc.y;
      doc.save();
      doc.rect(startX, yTopHdr, usableWidth, rowH).fillAndStroke("#005566", "#000");
      doc.fillColor("#fff").font("Times-Bold").fontSize(10);
      drawTextFit(doc, "Subject", startX + 6, yTopHdr + 4, colSubject - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "left" });
      drawTextFit(doc, "Code", startX + colSubject + 6, yTopHdr + 4, colCode - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
      drawTextFit(doc, "Mark", startX + colSubject + colCode + 6, yTopHdr + 4, colMark - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
      drawTextFit(doc, "Grade", startX + colSubject + colCode + colMark + 6, yTopHdr + 4, colGrade - 8, { baseSize: 10, minSize: 7, font: "Times-Bold", align: "center" });
      doc.rect(startX, yTopHdr, colSubject, rowH).stroke();
      doc.rect(startX + colSubject, yTopHdr, colCode, rowH).stroke();
      doc.rect(startX + colSubject + colCode, yTopHdr, colMark, rowH).stroke();
      doc.rect(startX + colSubject + colCode + colMark, yTopHdr, colGrade, rowH).stroke();
      doc.restore();

      doc.y = yTopHdr + rowH;

      // rows
      for (let i = 0; i < subjects.length; i++) {
        ensureSpace(doc, rowH + 8, () => drawHeaderForSlip());

        const yTop = doc.y;
        if (i % 2 === 1) {
          doc.rect(startX, yTop, usableWidth, rowH).fill("#f8f9fd");
        }

        const row = subjects[i];

        // ✅ Reset to black for Subject, Code, Mark
        doc.fillColor("#000").font("Times-Roman");
        drawTextFit(doc, row.Subject || "-", startX + 6, yTop + 5, colSubject - 8, {
          baseSize: 10,
          minSize: 7,
          font: "Times-Roman",
          align: "left",
        });

        doc.fillColor("#000").font("Times-Roman");
        drawTextFit(doc, row.Subject_Code || "-", startX + colSubject + 6, yTop + 5, colCode - 8, {
          baseSize: 10,
          minSize: 7,
          font: "Times-Roman",
          align: "center",
        });

        doc.fillColor("#000").font("Times-Roman");
        drawTextFit(doc, row.Mark || "-", startX + colSubject + colCode + 6, yTop + 5, colMark - 8, {
          baseSize: 10,
          minSize: 7,
          font: "Times-Roman",
          align: "center",
        });

        // ✅ Grade in green/red
        const isPass = PASSING_GRADES.has(String(row.Grade).toUpperCase());
        doc.fillColor(isPass ? "green" : "red").font("Times-Bold");
        drawTextFit(doc, row.Grade || "-", startX + colSubject + colCode + colMark + 6, yTop + 5, colGrade - 8, {
          baseSize: 10,
          minSize: 7,
          font: "Times-Bold",
          align: "center",
        });

        // reset back after grade
        doc.fillColor("#000").font("Times-Roman");

        // stroke borders
        doc.rect(startX, yTop, colSubject, rowH).stroke();
        doc.rect(startX + colSubject, yTop, colCode, rowH).stroke();
        doc.rect(startX + colSubject + colCode, yTop, colMark, rowH).stroke();
        doc.rect(startX + colSubject + colCode + colMark, yTop, colGrade, rowH).stroke();

        doc.y = yTop + rowH;
      }

      // footer
      const footerY = pageHeight - doc.page.margins.bottom - 30;
      doc.font("Times-Roman").fontSize(9).fillColor("#444");
      doc.text(`Issued by ${SCHOOL_NAME}`, doc.page.margins.left, footerY, {
        align: "left",
      });

      drawWatermark(doc, "MANFESS PREMOCK SLIP", pageWidth, pageHeight);
    }

    doc.end();
  } catch (err) {
    console.error("print-slips PDF error:", err);
    return res.status(500).send("Error generating slips");
  }
});

export default router;

