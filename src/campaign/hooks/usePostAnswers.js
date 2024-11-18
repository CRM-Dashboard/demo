import { useState } from "react";
import api from "../../services/api";
import { useSelector } from "react-redux";

const usePostAnswers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [error, setError] = useState("");
  const passWord = useSelector((state) => state.LoginReducer.passWord);
  const userName = useSelector((state) => state.LoginReducer.userName);

  const postAnswers = async (data) => {
    try {
      const url = `/api/campaign/post-answers`;
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("passWord", passWord);
      formData.append("data", JSON.stringify(data));
      setIsLoading(true);
      const res = (await api.post(url, formData)).status;
      if (res === 200) {
        setIsSuccess(true);
      }
      return res;
    } catch (error) {
      console.log("err", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { postAnswers, isLoading, isSuccess, error };
};

export default usePostAnswers;
