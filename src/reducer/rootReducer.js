import { combineReducers } from "redux";
import ThemeReducer from "../crm/pages/ThemeOptions/ThemeReducer";
import LoginReducer from "../crm/pages/Login/LoginReducer/LoginReducer";
import HomePageReducer from "../crm/pages/HomePage/HomePageReducer/HomePageReducer";
import SearchBarReducer from "../crm/pages/SearchBar/SearchBarReducer/SearchBarReducer";
import DashboardReducer from "../crm/pages/Dashboard/DashboardReducer.js/DashboardReducer";
import FileUploadReducer from "../crm/pages/Activity/FileUploader/FileReducer/FileUploadReducer";
import CustomerInfoReducer from "../crm/pages/Dashboard/CustomerInformation/CustomerInfoReducer/CustomerInfoReducer";
import BookingReducer from "../crm/pages/Reports/BookingReport/BookingDetails/BookingData/BookingReducer/BookingReducer";

const rootReducer = combineReducers({
  ThemeReducer,
  LoginReducer,
  homePage: HomePageReducer,
  dashboard: DashboardReducer,
  searchBar: SearchBarReducer,
  BookingReducer: BookingReducer,
  fileReducer: FileUploadReducer,
  customerInfoReducer: CustomerInfoReducer,
});

export default rootReducer;
