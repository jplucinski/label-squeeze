import { PDFDocument, PageSizes } from "pdf-lib";
import fs from "fs";

async function createTestPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage(PageSizes.A6);

  const { width, height } = page.getSize();
  page.drawText("Test Label", {
    x: 50,
    y: height - 50,
    size: 20,
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("/tmp/test-label.pdf", pdfBytes);
  console.log("Test PDF created at /tmp/test-label.pdf");
}

createTestPDF();
