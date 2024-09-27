/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import UseCustomSnackbar from "../snackbar/UseCustomSnackBar";
import CircularScreenLoader from "../../components/circularScreenLoader/CircularScreenLoader";

const PDFViewer = ({ url, formdata, object }) => {
  const [pdfData, setPdfData] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const orderId = reducerData.searchBar.orderId;
  const fade = useSpring({ from: { opacity: 0 }, to: { opacity: 4 } });

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: object,
      CHANGEIND: "",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  useEffect(() => {
    const apiUrl = url;
    fetch(apiUrl, formdata)
      .then((response) => response.json())
      .then(async (data) => {
        saveLog();
        setLoading(true);
        const pdfContent =
          data?.ArchCertPrint && data.ArchCertPrint.length > 0
            ? data.ArchCertPrint[0]
            : data;

        // Check if the content has a length greater than 0 (assuming pdfContent is a string or array)
        if (pdfContent && pdfContent.length > 0) {
          setPdfData(pdfContent);
        } else {
          snackbar.showError("No PDF Available!");
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [url]);

  useEffect(() => {
    // Convert the base64 string to a Uint8Array
    console.log("#########pdfData", pdfData);

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
    <animated.div style={fade}>
      {!loading ? (
        <CircularScreenLoader isModal />
      ) : pdfUrl ? (
        <iframe title="PDF Viewer" src={pdfUrl} width="100%" height="700px" />
      ) : (
        ""
      )}
    </animated.div>
  );
};

export default PDFViewer;
