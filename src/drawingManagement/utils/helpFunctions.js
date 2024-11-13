import axios from "axios";
import api from "../../services/api";
import { PDFDocument, rgb } from "pdf-lib";

export const uploadDocToS3 = async (folder, file, matnr) => {
  try {
    const url = `${process.env.REACT_APP_SERVER_URL}/api/drawing/generate-signed-url`;
    const formData = new FormData();
    formData.append("folder", folder);

    const uploadedUrl = (
      await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ).data;

    await axios.put(uploadedUrl, file, {
      headers: { "Content-Type": "application/pdf" },
    });

    const publicUrl = uploadedUrl.split("?")[0];
    console.log("publicUrl", publicUrl);
    return { publicUrl, matnr };
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const appendTextToPDF = async (
  pdfUrl,
  unit,
  unitX,
  unitY,
  floor,
  floorX,
  floorY,
  folder,
  matnr
) => {
  try {
    const response = await fetch(pdfUrl);
    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Set font size, color, and add the text at a specific position (x, y)
    firstPage.drawText(unit, {
      x: unitX,
      y: unitY,
      size: 18,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(floor, {
      x: floorX,
      y: floorY,
      size: 18,
      color: rgb(0, 0, 0),
    });

    // Serialize the modified PDF document to bytes
    const modifiedPdfBytes = await pdfDoc.save();

    const modifiedPdfFile = new File(
      [modifiedPdfBytes],
      "modified-document.pdf",
      {
        type: "application/pdf",
      }
    );
    // Upload the file to S3
    const res = await uploadDocToS3(folder, modifiedPdfFile, matnr);
    return res;
  } catch (error) {
    console.error("Error appending text to PDF:", error);
    return error;
  }
};
