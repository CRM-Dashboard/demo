// const DEFAULT_HEADERS = {
//   Accept: "application/json",
//   "Content-Type": "application/json",
// };

// const API_ENDPOINT = "/api";

// const handleResponse = (res, signal = null) => {
//   if (!res.ok && (!signal?.aborted ?? true)) {
//     throw new Error(`Bad response from server ${res.status}`);
//   }
//   return res;
// };

// const handleError = (err) => {
//   console.log("apiService", err);
//   throw new Error(err);
// };

// export const unhandledGet = (
//   endpoint,
//   headers = DEFAULT_HEADERS,
//   signal = null
// ) =>
//   fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "GET",
//     headers,
//     signal,
//   });

// export const get = (endpoint, headers = DEFAULT_HEADERS, signal = null) => {
//   return fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "GET",
//     headers,
//     signal,
//   })
//     .then(handleResponse)
//     .catch(handleError);
// };

// export const callApi = (URL) => {
//   return fetch(URL)
//     .then((res) => handleResponse(res))
//     .then((res) => res.json())
//     .catch((err) => {
//       console.log("apiService", err);
//     });
// };

// export const post = (
//   endpoint,
//   data,
//   headers = DEFAULT_HEADERS,
//   signal = null
// ) => {
//   return fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(data),
//     signal,
//   })
//     .then((res) => handleResponse(res, signal))
//     .then((res) => res.json())
//     .catch(handleError);
// };

// export const unhandledPost = (
//   endpoint,
//   data,
//   headers = DEFAULT_HEADERS,
//   signal = null
// ) =>
//   fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(data),
//     signal,
//   });

// export const postNotJSON = (
//   endpoint,
//   data,
//   headers = DEFAULT_HEADERS,
//   signal = null
// ) => {
//   return fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "POST",
//     headers,
//     body: JSON.stringify(data),
//     signal,
//   })
//     .then(handleResponse)
//     .catch(handleError);
// };

// export const unhandledPut = (
//   endpoint,
//   data,
//   headers = DEFAULT_HEADERS,
//   signal = null
// ) =>
//   fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "PUT",
//     headers,
//     body: JSON.stringify(data),
//     signal,
//   });

// export const put = (endpoint, data, headers = DEFAULT_HEADERS, signal = null) =>
//   fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "PUT",
//     headers,
//     body: JSON.stringify(data),
//     signal,
//   })
//     .then(handleResponse)
//     .catch(handleError);

// export const deleteEntry = (
//   endpoint,
//   data,
//   headers = DEFAULT_HEADERS,
//   signal = null
// ) =>
//   fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "DELETE",
//     headers,
//     body: JSON.stringify(data),
//     signal,
//   })
//     .then(handleResponse)
//     .catch(handleError);

// export const deleteOne = (endpoint) =>
//   fetch(`${API_ENDPOINT}${endpoint}`, {
//     method: "DELETE",
//   })
//     .then(handleResponse)
//     .catch(handleError);
