import React from "react";
const styles = {
  container: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    // minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
    fontSize: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    overflow: "hidden",
  },
  emailHeader: {
    borderBottom: "2px solid #e0e0e0",
    marginBottom: "15px",
    paddingBottom: "10px",
  },
  subject: {
    margin: 0,
    fontSize: "1.5rem",
    color: "#007BFF",
  },
  content: {
    color: "#555",
    fontSize: "1rem",
    lineHeight: "1.6",
  },
};

const EmailCart = ({ content }) => {
  return (
    <div style={styles.container}>
      {/* <h1 style={styles.header}>📧 My Emails</h1> */}
      <div style={styles.grid}>
        {/* {emails.map((email, index) => ( */}

        <div style={styles.card}>
          {/* <div style={styles.emailHeader}>
            <h2 style={styles.subject}>Email {1}</h2>
          </div> */}
          <div
            style={styles.content}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* ))} */}
      </div>
    </div>
  );
};

export default EmailCart;
