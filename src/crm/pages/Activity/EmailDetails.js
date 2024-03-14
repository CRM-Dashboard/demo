/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useMsal } from "react-aad-msal";

const EmailDetails = () => {
  const { instance, accounts } = useMsal();
  const [emails, setEmails] = useState([]);

  const getEmails = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ["Mail.Read"],
        account: accounts[0], // Assuming there's only one account
      });
      const accessToken = response.accessToken;
      const emailResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/messages",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await emailResponse.json();
      setEmails(data.value);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  useEffect(() => {
    getEmails();
  }, [instance, accounts]); //instance, accounts

  return (
    <div>
      <h2>Emails</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>{email.subject}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmailDetails;
