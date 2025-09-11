import express from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from '../../../middlewares/db.js';

const router = express.Router();

/* CONFIGURATIONS */
const PAGE_SIZE = "A4";
const PAGE_LAYOUT = "portrait";
const MARGIN = 36;
const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 40;
const ROW_HEIGHT = 24;
const CELL_PADDING = 6;

// Color palette
const COLORS = {
  primary: "#0A3D62", // Dark blue for headers
  text: "#333333", // Dark gray for body text
  lightText: "#777777", // Lighter gray for subtitles
  border: "#CCCCCC", // Light gray for borders
  pass: "#27AE60", // Green for passing grades
  fail: "#E74C3C", // Red for failing grades
};

// Font settings - use built-in PDFKit fonts for maximum stability
const FONTS = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
};

/* HELPER FUNCTIONS */
const safeString = (value) => (value === null || value === undefined ? "" : String(value).trim());

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const getGradeColor = (grade) => {
  const upperGrade = safeString(grade).toUpperCase();
  return ["A", "B", "C"].includes(upperGrade) ? COLORS.pass : COLORS.fail;
};

/* ROUTE HANDLER */
router.get("/", async (req, res) => {
  try {
    const sequence = req.query.sequence || null;
    const sql = `
      SELECT studentname, Class, Subject, Subject_Code, Mark, Grade
      FROM mock_results_olevel
      ${sequence ? "WHERE sequence = ?" : ""}
      ORDER BY studentname, Subject;
    `;
    const params = sequence ? [sequence] : [];
    const [rows] = await db.query(sql, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ ok: false, message: "No results found." });
    }

    // Build data structures
    const students = [];
    const subjects = [];
    const resultsByStudent = {};
    const studentClasses = {};

    rows.forEach((row) => {
      const studentName = safeString(row.studentname);
      const subject = safeString(row.Subject);
      if (!students.includes(studentName)) students.push(studentName);
      if (!subjects.includes(subject)) subjects.push(subject);
      resultsByStudent[studentName] = resultsByStudent[studentName] || {};
      resultsByStudent[studentName][subject] = {
        mark: safeString(row.Mark),
        grade: safeString(row.Grade),
      };
      if (!studentClasses[studentName] && row.Class) {
        studentClasses[studentName] = safeString(row.Class);
      }
    });

    // Initialize PDF doc and stream
    const doc = new PDFDocument({
      size: PAGE_SIZE,
      layout: PAGE_LAYOUT,
      margin: MARGIN,
      autoFirstPage: false,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=mock_results.pdf");
    doc.pipe(res);

    // Immediately add first page so doc.page is available
    doc.addPage();

    // Usable dims (safe because we added a page)
    const usableWidth = doc.page.width - MARGIN * 2;
    const usableHeight = doc.page.height - MARGIN * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;

    // Images paths (safe checks)
    const letterheadPath = path.join(process.cwd(), "public", "logo.png");
    const companyLogoPath = path.join(process.cwd(), "public", "logo.png");

    // Table sizing: student column + dynamic subject columns
    const studentColWidth = 140; // name column width
    // Ensure at least 1 column and reasonable minimum width
    const minSubjectCol = 70;
    const maxSubjectColsFit = Math.max(1, Math.floor((usableWidth - studentColWidth) / minSubjectCol));
    // If subjects > maxSubjectColsFit we'll split horizontally into chunks
    const subjectChunks = chunkArray(subjects, maxSubjectColsFit);

    // vertical pagination per page: compute rows that fit
    const rowsPerPage = Math.max(4, Math.floor((usableHeight - 36) / ROW_HEIGHT));

    // header drawing
    function drawHeader(currentYStart = MARGIN) {
      let currentY = currentYStart;

      // Draw letterhead image centered if exists
      if (fs.existsSync(letterheadPath)) {
        try {
          // fit image into header height leaving small padding
          doc.image(letterheadPath, MARGIN, currentY, { width: usableWidth, height: HEADER_HEIGHT - 18, align: "center" });
          currentY += HEADER_HEIGHT - 18;
        } catch (e) {
          // fallback to text if image error
          currentY += 2;
        }
      }

      // If image not present or we want text, write school info (this will not overlap because currentY moved)
      if (!fs.existsSync(letterheadPath)) {
        doc.font(FONTS.bold).fontSize(14).fillColor(COLORS.primary)
          .text("MA NDUM FAVOURED EVENING SECONDARY SCHOOL (MANFESS)", MARGIN, currentY, { align: "center", width: usableWidth });
        currentY += 18;
        doc.font(FONTS.regular).fontSize(9).fillColor(COLORS.lightText)
          .text("LOCATED AT BELMON BILINGUAL HIGH SCHOOL, 200 METERS FROM RAIL OPPOSITE ROYAL CITY, RAIL - BONABERI – DOUALA - CAMEROON.", MARGIN, currentY, { align: "center", width: usableWidth });
        currentY += 14;
        doc.text("Tel. 682 55 35 03 / 673 037 555 / 677 517 606", { align: "center", width: usableWidth });
        currentY += 14;
        doc.fontSize(8).text("AUT.Nº: GEN- 430/23/MINESEC/SG/DESG/SDSGEPESG/SSGEPES/27/SEPT/2023   AUT.Nº: TECH - 035/24/MINESEC/...", MARGIN, currentY, { align: "center", width: usableWidth });
        currentY += 12;
      }

      // Draw small company logo top-left (if present) without clashing
      if (fs.existsSync(companyLogoPath)) {
        try {
          doc.image(companyLogoPath, MARGIN, MARGIN + 8, { width: 56, height: 56 });
        } catch (e) {
          /* ignore image drawing errors */
        }
      }

      // Title centered below letterhead
      doc.font(FONTS.bold).fontSize(12).fillColor(COLORS.primary)
        .text("GENERAL MOCK O'LEVEL RESULTS", MARGIN, MARGIN + HEADER_HEIGHT - 36, { align: "center", width: usableWidth });

      if (sequence) {
        doc.font(FONTS.regular).fontSize(9).fillColor(COLORS.lightText)
          .text(`Sequence: ${sequence}`, MARGIN, MARGIN + HEADER_HEIGHT - 18, { align: "center", width: usableWidth });
      }

      // separator
      doc.moveTo(MARGIN, MARGIN + HEADER_HEIGHT).lineTo(MARGIN + usableWidth, MARGIN + HEADER_HEIGHT)
        .lineWidth(0.6).strokeColor(COLORS.border).stroke();

      return MARGIN + HEADER_HEIGHT; // y position to start layout from
    }

    // footer drawing
    function drawFooter() {
      const footerY = doc.page.height - MARGIN - FOOTER_HEIGHT + 8;
      doc.font(FONTS.regular).fontSize(8).fillColor(COLORS.lightText)
        .text(`Generated: ${new Date().toLocaleString()}`, MARGIN, footerY, { align: "left" });
      doc.text("Powered by VDash Network", MARGIN, footerY + 12, { align: "left" });
      doc.text(`Page ${doc.page.number}`, MARGIN + usableWidth - 60, footerY, { align: "right" });
    }

    // Draw a single subject-chunk table across possibly multiple vertical pages.
    // The table will be centered horizontally on the page.
    function drawTableForSubjectChunk(subjChunk) {
      // compute widths for this chunk so table can be centered
      const subjectColW = Math.max(minSubjectCol, Math.floor((usableWidth - studentColWidth) / subjChunk.length));
      const totalTableWidth = studentColWidth + subjectColW * subjChunk.length;
      const offsetX = MARGIN + Math.floor((usableWidth - totalTableWidth) / 2); // center table

      // Prepare table header values
      const headerTopY = MARGIN + HEADER_HEIGHT + 10;
      const headerHeightUsed = 22;

      // Split students vertically into pages
      const studentPages = chunkArray(students, rowsPerPage);

      studentPages.forEach((studentChunk, pageIndex) => {
        // For first overall page: we already added page; for subsequent pages add a new one
        if (doc.page && doc.page._pageBuffer && doc.page.number > 0 && !(doc.page.number === 1 && pageIndex === 0 && subjChunk === subjectChunks[0])) {
          // If current page is not the right one, add a new page. (This avoids duplicating first page)
        }
        if (!(doc.page && doc.page.number === 1 && pageIndex === 0 && subjChunk === subjectChunks[0])) {
          doc.addPage();
        }

        // draw header & footer on this page
        drawHeader();
        drawFooter();

        // draw header row background
        doc.rect(offsetX, headerTopY, totalTableWidth, headerHeightUsed).fillOpacity(0.03).fill(COLORS.subtle).fillOpacity(1);

        // Draw header labels: Student | Subject columns
        doc.font(FONTS.bold).fontSize(9).fillColor(COLORS.text);
        doc.text("Student", offsetX + CELL_PADDING, headerTopY + 4, { width: studentColWidth - CELL_PADDING * 2, align: "left" });

        // Subject headers centered
        let hx = offsetX + studentColWidth;
        for (const subj of subjChunk) {
          doc.text(subj, hx + CELL_PADDING, headerTopY + 4, { width: subjectColW - CELL_PADDING * 2, align: "center" });
          hx += subjectColW;
        }

        // header underline
        doc.moveTo(offsetX, headerTopY + headerHeightUsed).lineTo(offsetX + totalTableWidth, headerTopY + headerHeightUsed).strokeColor(COLORS.border).lineWidth(0.5).stroke();

        // Draw rows
        let rowY = headerTopY + headerHeightUsed + 6;
        doc.font(FONTS.regular).fontSize(9).fillColor(COLORS.text);

        for (const student of studentChunk) {
          // Student name cell
          doc.text(student, offsetX + CELL_PADDING, rowY, { width: studentColWidth - CELL_PADDING * 2, align: "left" });

          // Subject cells
          let cx = offsetX + studentColWidth;
          for (const subj of subjChunk) {
            const res = (resultsByStudent[student] && resultsByStudent[student][subj]) || null;
            if (res) {
              const markText = safeString(res.mark);
              const gradeText = safeString(res.grade).toUpperCase();
              const gcol = getGradeColor(gradeText);
              // mark on top (center)
              doc.fillColor(COLORS.text).text(markText, cx + CELL_PADDING, rowY, { width: subjectColW - CELL_PADDING * 2, align: "center" });
              // colored grade box below mark
              const boxY = rowY + 12;
              const boxX = cx + CELL_PADDING;
              const boxW = subjectColW - CELL_PADDING * 2;
              const boxH = 14;
              doc.rect(boxX, boxY, boxW, boxH).fillOpacity(0.18).fill(gcol).fillOpacity(1);
              doc.fillColor("#000000").font(FONTS.bold).fontSize(8).text(gradeText, boxX, boxY + 2, { width: boxW, align: "center" });
              // restore font
              doc.font(FONTS.regular).fontSize(9).fillColor(COLORS.text);
            } else {
              doc.fillColor(COLORS.lightText).text("-", cx + CELL_PADDING, rowY, { width: subjectColW - CELL_PADDING * 2, align: "center" });
            }
            cx += subjectColW;
          }

          // row separator
          rowY += ROW_HEIGHT;
          doc.moveTo(offsetX, rowY - 6).lineTo(offsetX + totalTableWidth, rowY - 6).strokeColor(COLORS.border).lineWidth(0.3).stroke();
        }

        // Draw outer rectangle border for the table area for this page
        const tableHeight = (studentChunk.length * ROW_HEIGHT) + headerHeightUsed + 12;
        doc.rect(offsetX, headerTopY, totalTableWidth, tableHeight).lineWidth(0.6).strokeColor(COLORS.border).stroke();
      });
    } // end drawTableForSubjectChunk

    // Build document pages for each horizontal subject chunk:
    subjectChunks.forEach((subjChunk, idx) => {
      // For first chunk: we already have initial page, but drawTable function manages new pages internally
      drawTableForSubjectChunk(subjChunk);
    });

    // finalize PDF
    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ ok: false, message: error.message });
    }
    try { res.end(); } catch (_) {}
  }
});

export default router;
