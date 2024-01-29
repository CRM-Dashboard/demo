import { combineReducers } from "redux";
import ThemeReducer from "../crm/pages/ThemeOptions/ThemeReducer";
import LoginReducer from "../crm/pages/Login/LoginReducer/LoginReducer";
import HomePageReducer from "../crm/pages/HomePage/HomePageReducer/HomePageReducer";
import SearchBarReducer from "../crm/pages/SearchBar/SearchBarReducer/SearchBarReducer";
import DashboardReducer from "../crm/pages/Dashboard/DashboardReducer.js/DashboardReducer";

const rootReducer = combineReducers({
  ThemeReducer,
  LoginReducer,
  homePage: HomePageReducer,
  dashboard: DashboardReducer,
  searchBar: SearchBarReducer,
});

export default rootReducer;
