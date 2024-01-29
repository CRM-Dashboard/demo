/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

const PDFViewer = ({ url }) => {
  const [pdfData, setPdfData] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiUrl = url;
    fetch(apiUrl)
      .then((response) => response.json())
      .then(async (data) => {
        setLoading(true);
        setPdfData(data);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    // Convert the base64 string to a Uint8Array
    const pdfBytes = atob([pdfData]);
    const pdfArray = new Uint8Array(pdfBytes.length);
    for (let i = 0; i < pdfBytes.length; i++) {
      pdfArray[i] = pdfBytes.charCodeAt(i);
    }

    // Create a Blob from the Uint8Array
    const pdfBlob = new Blob([pdfArray], { type: "application/pdf" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(pdfBlob);

    setPdfUrl(url);

    // Clean up the URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfData]);
  return (
    <div>
      {!loading ? (
        <CircularScreenLoader isModal />
      ) : pdfUrl ? (
        <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="700px" />
      ) : (
        ""
      )}
    </div>
  );
};

export default PDFViewer;
