import React from "react";
import { MsalAuthProvider } from "react-aad-msal";

const AuthProvider = ({ children }) => {
  const authConfig = {
    clientId: "ee6e5d84-cf48-41cb-95d6-0e04536e8902",
    authority:
      "https://login.microsoftonline.com/1ffdaf05-2430-4698-99e2-38709d0286ad",
    redirectUri: "http://localhost:3000/crm/crm/activities",
  };

  return (
    <MsalAuthProvider
      instance={authConfig}
      // Add any other required configuration options
    >
      {children}
    </MsalAuthProvider>
  );
};

export default AuthProvider;
