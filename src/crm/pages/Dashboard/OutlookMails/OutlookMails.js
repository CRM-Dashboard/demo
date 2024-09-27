/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Grid, Typography, Divider } from "@mui/material";
// import { Configuration, OpenAIApi } from "openai";
import "./Style.css";

function Mails() {
  const reducerData = useSelector((state) => state);
  const customerEmailId = reducerData.dashboard.customerEmailId;

  // const [prompt, setPrompt] = useState("");
  // const [result, setResult] = useState("");
  // const [loading, setLoading] = useState(false);
  const [mailData, setMailData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [nextDataLink, setNextDataLink] = useState("");
  // const [shouldGenerateReply, setShouldGenerateReply] = useState(false);

  // const configuration = new Configuration({
  //   apikey: process.env.REACT_APP_OPENAI_API_KEY,
  // });

  // const openai = new OpenAIApi(configuration);

  // const handleClick = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await openai.createCompletion({
  //       model: "text-davinsi-003",
  //       prompt: prompt,
  //       temperature: 0.5,
  //       max_tokens: 100,
  //     });
  //     setResult(response.data.choices[0].text);
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    if (tableData?.[0]) {
      setMailData(tableData?.[0]?.body?.content);
    }
  }, [tableData]);

  // function htmlToText(html) {
  //   // Create a new temporary element to hold the HTML
  //   const tempDiv = document.createElement("div");
  //   tempDiv.innerHTML = html;
  //   // Extract the text content
  //   return tempDiv.textContent || tempDiv.innerText || "";
  // }

  // const getGeneratedResult = () => {
  //   if (prompt) {
  //     const formData = new FormData();
  //     const finaldata = htmlToText(prompt);
  //     formData.append("prompt", JSON.stringify(finaldata));

  //     fetch(
  //       process.env.REACT_APP_SERVER_URL +
  //         `/api/activity/generateOpenAIResponse`,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("############data", data);
  //         setResult(data);
  //       })
  //       .catch((error) => {
  //         console.log("##########error", error);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   getGeneratedResult();
  // }, [prompt]);

  const getMailDetails = () => {
    if (customerEmailId) {
      const formData = new FormData();
      formData.append("nextDataLink", nextDataLink);
      formData.append("customerEmailId", customerEmailId);

      fetch(process.env.REACT_APP_SERVER_URL + `/api/activity/getMail`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setTableData(data.value);
          var nextDataLink = Object.keys(data).map((key) => data[key]);
          setNextDataLink(nextDataLink[2]);
          console.log("mails data", nextDataLink[2]);
        });
    } else {
      setMailData([]);
      setTableData([]);
      setNextDataLink("");
    }
  };

  useEffect(() => {
    getMailDetails();
  }, [customerEmailId]);

  useEffect(() => {
    getMailDetails();
  }, []);

  const getDateAndTime = (dateString) => {
    const dateTime = new Date(dateString);

    // Extracting date
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1; // Month is zero-based, so we add 1
    const date = dateTime.getDate();

    // Extracting time
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    return `${year}/${month}/${date}  ${hours}:${minutes}`;
  };

  // const getInitials = (name) => {
  //   if (!name) return "";

  //   const words = name.trim().split(/\s+/);
  //   const initials = words.map((word) => word[0].toUpperCase()).join("");
  //   return initials;
  // };

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          justifyContent: "right",
          alignItems: "right",
          marginTop: "0.5em",
        }}
      >
        <Button
          onClick={() => {
            getMailDetails();
          }}
          disabled={!(mailData?.length > 0)}
        >
          Next
        </Button>
      </Grid>
      {/* {tableData?.length > 0 ? */}
      {/* {shouldGenerateReply ? (
        <Grid
          sx={{
            justifyContent: "centre",
            alignItems: "center",
            height: "50vh",
            width: "100vw",
          }}
        >
          <Grid
            sx={{
              height: "20em",
              width: "20em",
              border: "1px solid black",
              borderRadius: "5px",
            }}
          >
            <Button
              onClick={() => {
                getGeneratedResult();
              }}
            >
              Generate
            </Button>
            <Typography>{result}</Typography>
          </Grid>
        </Grid>
      ) : ( */}
      <Grid sx={{ marginLeft: "1%" }}>
        <Grid
          container
          columnGap={3}
          rowSpacing={1}
          columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
          columns={12}
          sx={{ display: "flex", marginTop: "1em", overflow: "visible" }}
        >
          <Grid
            item
            xs={3}
            sm={3}
            md={3}
            lg={3}
            sx={{ backgroundColor: "white" }}
          >
            {tableData?.map((mailData) => {
              return (
                <>
                  <Grid
                    container
                    columns={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "space-around",
                    }}
                  >
                    {/* <div
                      item
                      md={2}
                      sm={2}
                      lg={2}
                      xs={2}
                      className="circularImg"
                    >
                      <label
                        style={{
                          // paddingLeft: "22%",
                          // paddingTop: "30%",
                          height: "0.2em",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "22px",
                          color: "white",
                        }}
                      >
                        {" "}
                        {getInitials(
                          mailData?.toRecipients[0]?.emailAddress?.name
                        )}
                      </label>
                    </div> */}
                    <Grid
                      item
                      md={7}
                      sm={7}
                      lg={7}
                      xs={7}
                      sx={{
                        paddingTop: "0.5em",
                        paddingBottom: "0.5em",
                        paddingLeft: "0.5em",
                        wordBreak: "break-all",
                      }}
                      onClick={() => {
                        // setShouldGenerateReply(true);
                        // setPrompt(mailData?.bodyPreview);
                        console.log(
                          "mailData?.body?.content",
                          mailData?.body?.content
                        );
                        setMailData(mailData?.body?.content);
                      }}
                    >
                      <Grid sx={{ fontSize: "12px" }}>
                        {mailData?.sender?.emailAddress?.address}
                      </Grid>
                      <Grid sx={{ fontSize: "12px", cursor: "pointer" }}>
                        {mailData?.subject}
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={3}
                      lg={3}
                      xs={3}
                      sx={{ fontSize: "11px" }}
                    >
                      {getDateAndTime(mailData?.receivedDateTime)}
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              );
            })}
          </Grid>
          <Divider orientation="vertical" />
          <Grid
            item
            xs={8}
            sm={8}
            md={8}
            lg={8}
            sx={{ backgroundColor: "white" }}
          >
            <Typography
              style={{
                height: "0.2em",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "22px",
                color: "white",
              }}
            >
              {" "}
              {/* {getInitials(mailData?.toRecipients[0]?.emailAddress?.name)} */}
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: mailData }} />
          </Grid>
        </Grid>
      </Grid>
      {/* )} */}
      {/* : "" } */}
    </>
  );
}

export default Mails;
