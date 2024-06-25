const initialState = {
  fileUrls: [],
};

const FileUploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPLOADED_FILE(S)_URLS":
      return {
        ...state,
        fileUrls: action.payload,
      };
    case "RESET_ALL_DATA":
      return initialState;
    default:
      return state;
  }
};

export default FileUploadReducer;
