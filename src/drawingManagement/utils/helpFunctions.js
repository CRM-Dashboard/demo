import axios from "axios";
import api from "../../services/api";
import { degrees, PDFDocument, rgb } from "pdf-lib";

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
    // firstPage.setRotation(degrees(90));

    const size = firstPage.getSize();
    const { width, height } = size;
    console.log("size", size);

    let updatedUnitX = 0;
    let updatedUnitY = 0;
    let updatedFloorX = 0;
    let updatedFloorY = 0;

    if (width === 1191 && height === 842) {
      updatedUnitX = 870;
      updatedUnitY = 740;
      updatedFloorX = 780;
      updatedFloorY = 90;
    } else if (width === 1191 && height === 1684) {
      updatedUnitX = 1050;
      updatedUnitY = 400;
      updatedFloorX = 150;
      updatedFloorY = 400;
    }

    // Set font size, color, and add the text at a specific position (x, y)
    firstPage.drawText(unit, {
      x: updatedUnitX,
      y: updatedUnitY,
      rotate: degrees(height === 1684 ? -90 : 0),
      size: 20,
      color: rgb(0, 0, 0),
    });

    firstPage.drawText(floor, {
      x: updatedFloorX,
      y: updatedFloorY,
      size: 20,
      rotate: degrees(height === 1684 ? -90 : 0),
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
