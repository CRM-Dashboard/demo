// import { get, post, put, deleteOne, deleteEntry, callApi } from "./apiService";

// // const CRM_ENDPOINT = "";
// // const CRM_DISTRICT_ENDPOINT = "";
// // export const getCall = (tableName) =>
// //   get(`${CRM_ENDPOINT}/${tableName}`)
// //     .then((res) => res.json())
// //     .catch((err) => Promise.reject(err));

// // export const getAllCall = (tableName) =>
// //   get(`${CRM_ENDPOINT}/getAll/${tableName}`)
// //     .then((res) => res.json())
// //     .catch((err) => Promise.reject(err));

// // export const createCall = (tableName, data) =>
// //   post(`${CRM_ENDPOINT}/${tableName}`, data)
// //     .then((res) => res)
// //     .catch((err) => Promise.reject(err));

// // export const updateCall = (tableName, data) =>
// //   post(`${CRM_ENDPOINT}/${tableName}`, data)
// //     .then((res) => res)
// //     .catch((err) => Promise.reject(err));

// // export const deleteCall = (tableName, data, id) =>
// //   put(`${CRM_ENDPOINT}/${tableName}/${id}`, data)
// //     .then((res) => res.json())
// //     .catch((err) => Promise.reject(err));

// // export const deleteOneCall = (tableName, data) =>
// //   deleteEntry(`${CRM_ENDPOINT}/${tableName}`, data)
// //     .then((res) => res.json())
// //     .catch((err) => Promise.reject(err));

// // export const deleteOtherCall = (tableName, data) =>
// //   deleteEntry(`${CRM_DISTRICT_ENDPOINT}/${tableName}`, data)
// //     .then((res) => res.json())
// //     .catch((err) => Promise.reject(err));

// export const customCall = (url, method, data) => {
//   switch (method) {
//     case "GET":
//       return get(url)
//         .then((res) => res.json())
//         .catch((err) => Promise.reject(err));
//     case "POST":
//       return post(url, data)
//         .then((res) => res)
//         .catch((err) => Promise.reject(err));
//     case "PUT":
//       return put(url, data)
//         .then((res) => res.json())
//         .catch((err) => Promise.reject(err));
//     case "DELETE":
//       return deleteOne(url, data)
//         .then((res) => res.json())
//         .catch((err) => Promise.reject(err));
//     case "DELETEALL":
//       return deleteEntry(url, data).catch((err) => Promise.reject(err));
//     case "":
//       return callApi(url).catch((err) => Promise.reject(err));
//     default:
//       return null;
//   }
// };
