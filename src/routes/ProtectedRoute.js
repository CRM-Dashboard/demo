import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UseCustomSnackbar from "../crm/components/snackbar/UseCustomSnackBar";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Start as null for loading state
    const snackbar = UseCustomSnackbar();
    // const user = JSON.parse(localStorage.getItem("user"));
    const user = useSelector((state) => state.LoginReducer);
    const { userName, passWord } = user;

    const checkValidUser = () => {
        if (userName || passWord) {
            setIsAuthenticated(true);
        } else {
            snackbar.showError(
                "Access not granted. Please Login with correct Credentials!"
            );
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkValidUser();
    }, []); // No dependencies to prevent re-running

    // Show a loading state while checking authentication
    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
