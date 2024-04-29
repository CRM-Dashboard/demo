import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PersonIcon from "@mui/icons-material/Person";
import { Button, Avatar, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import EmailDetails from "./EmailDetails";
// import AuthProvider from "./AuthProvider";

const HtmlToText = ({ html }) => {
  const createMarkup = (html) => {
    return { __html: html };
  };

  const sanitizeHtml = (html) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText;
  };

  return (
    <>
      <div>
        {/* Use dangerouslySetInnerHTML to render HTML content */}
        <div dangerouslySetInnerHTML={createMarkup(html)} />

        {/* Display text content without HTML tags */}
        <p>{sanitizeHtml(html)}</p>
      </div>
    </>
  );
};

export default class Updates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.modules = {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
    };
    this.formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
    ];
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  daysAgo(date) {
    const currentDate = new Date();
    const givenDate = new Date(date);

    // Calculate the difference in milliseconds
    const difference = currentDate - givenDate;

    // Calculate the difference in days
    const days = Math.floor(difference / (24 * 60 * 60 * 1000));

    return days;
  }

  render() {
    return (
      <div style={{ backgroundColor: "white", padding: "2em" }}>
        <>
          {" "}
          <ReactQuill
            value={this.state.text}
            modules={this.modules}
            formats={this.formats}
            onChange={this.handleChange}
            theme="snow"
            style={{ marginTop: "10px" }}
            bounds={".app"}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ backgroundColor: "green", color: "white", margin: "1em" }}
            >
              Update
            </Button>
          </div>
          <br />
          <div
            style={{
              height: "8em",
              marginLeft: "8em",
              marginRight: "8em",
              borderRadius: "0.5em",
              border: "1px solid",
              boxShadow: "2px 2px 2px 2px gray",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ padding: "0.5em", display: "flex" }}>
              <Avatar
                sx={{
                  backgroundColor: "black",
                  height: "1.2em",
                  width: "1.2em",
                }}
              >
                <PersonIcon sx={{ backgroundColor: "black" }} />
              </Avatar>
              <Typography sx={{ marginLeft: "0.5em", marginRight: "0.5em" }}>
                {" "}
                Aishwarya Bingewar
              </Typography>
            </div>
            <div style={{ padding: "0.5em", display: "flex" }}>
              {" "}
              <AccessTimeIcon fontSize="small" />
              <Typography>
                {" "}
                {this.daysAgo("12-31-2023") + " d"}
                {/* Date should be in format MM-DD-YYYY */}
              </Typography>
            </div>
          </div>
          <br />
          Text: {<HtmlToText html={this.state.text} />}
        </>
        {/* <AuthProvider>
          <div>
            <EmailDetails />
          </div>
        </AuthProvider> */}
      </div>
    );
  }
}
