const setUploadFileUrls = (data) => {
  return {
    type: "UPLOADED_FILE(S)_URLS",
    payload: data,
  };
};

const exportDefault = {
  setUploadFileUrls,
};

export default exportDefault;
