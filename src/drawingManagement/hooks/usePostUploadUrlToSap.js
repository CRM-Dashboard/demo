import { useSelector } from "react-redux";
import api from "../../services/api";

// const url = "/api/drawing/upload-url-sap";
// const formData = new FormData();
// formData.append("userName", userName);
// formData.append("passWord", passWord);
// formData.append("matnr", parseMatnr);
// formData.append("passUrl", publicUrl);
// const res = await api.post(url, formData, {
//   headers: { "Content-Type": "multipart/form-data" },
// });

const usePostUploadUrlToSap = () => {
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);

  const postToSap = async (matnr, publicUrl) => {
    try {
      const url = "/api/drawing/upload-url-sap";
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("matnr", matnr);
      formData.append("passUrl", publicUrl);
      const res = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (error) {
      return error;
    }
  };

  return { postToSap };
};

export default usePostUploadUrlToSap;
