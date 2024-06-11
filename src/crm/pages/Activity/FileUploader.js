// /* eslint-disable no-useless-concat */
// /* eslint-disable react-hooks/exhaustive-deps */
// // import AWS from "aws-sdk";
// import { useState } from "react";
// import { useSelector } from "react-redux";

// function FileUploader() {
//   // Create state to store file
//   const reducerData = useSelector((state) => state);
//   const OrderId = reducerData.searchBar.orderId;

//   const [files, setFiles] = useState([]);

//   const uploadFile = async () => {
//     if (files) {
//       const apiUrl =
//         process.env.REACT_APP_SERVER_URL + "/api/activity/uploadFileToS3";

//       var finalFiles = [];
//       files.forEach((file) => {
//         if (new Blob([file.buffer])) {
//           finalFiles.push({
//             originalname: file.originalname,
//             buffer: new Blob([file.buffer], { type: file.mimetype }),
//             mimetype: file.mimetype,
//           });
//         }
//       });

//       const formData = new FormData();
//       files.forEach((file) => {
//         const blob = new Blob([file.buffer], { type: file.mimetype });
//         formData.append("files", blob, file.originalname);
//       });
//       formData.append("folderName", "CashBack" + "/" + OrderId);

//       fetch(apiUrl, {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Network response was not ok");
//           }
//           return response.json();
//         })
//         .then((data) => {
//           if (data) {
//             console.log("file urls############", data);
//             alert("Uploaded Successfully!");
//           } else {
//             alert("Error");
//           }
//         });
//     }
//   };

//   const handleFileChange = (e) => {
//     const fileList = Array.from(e.target.files);
//     const readFiles = [];

//     fileList.forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         readFiles.push({
//           originalname: file.name,
//           buffer: event.target.result,
//           mimetype: file.type,
//         });
//         if (readFiles.length === fileList.length) {
//           setFiles(readFiles);
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     });
//   };

//   return (
//     <div className="App">
//       <div>
//         <input type="file" multiple onChange={handleFileChange} />
//         <button onClick={uploadFile}>Upload</button>
//       </div>
//     </div>
//   );
// }

// export default FileUploader;
