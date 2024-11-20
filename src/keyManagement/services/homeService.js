import api from "../../services/api";

export const fetchProjects = async ({ queryKey }) => {
  try {
    const [_, userName, passWord] = queryKey;
    console.log("username", userName, passWord);
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    const url = `/api/project`;
    const respose = (await api.post(url, formData))?.data?.ProjectList;
    return respose;
  } catch (error) {
    return error;
  }
};

export const getOrderData = async ({ queryKey }) => {
  try {
    const [_, userName, passWord, selectedProjects] = queryKey;
    const formData = new FormData();

    formData.append("orderId", "");
    formData.append("userName", userName);
    formData.append("passWord", passWord);

    formData.append("crmId", "");
    formData.append("crmIds", "");
    formData.append("projectIds", selectedProjects.toString());

    const url = `/api/dashboard/so_list`;
    const response = (await api.post(url, formData)).data;
    if (response) {
      return response[0].orderdata;
    }
  } catch (error) {
    return error;
  }
};
