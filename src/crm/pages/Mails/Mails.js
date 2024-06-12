/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Grid } from "@mui/material";
import { Divider } from "@mui/material";

function Mails() {
  const reducerData = useSelector((state) => state);
  const customerEmailId = reducerData.dashboard.customerEmailId;

  const [tableData, setTableData] = useState([]);
  const [nextDataLink, setNextDataLink] = useState("");
  const [mailData, setMailData] = useState([]);

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
      setTableData([]);
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
        >
          Next
        </Button>
      </Grid>
      {/* {tableData?.length > 0 ? */}
      <Grid sx={{ marginLeft: "1%", backgroundColor: "white" }}>
        <Grid
          container
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
            sx={{ backgroundColor: "white", paddingRight: "1em" }}
          >
            {tableData?.map((mailData) => {
              return (
                <>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 2, sm: 2, md: 2, lg: 2 }}
                    columns={12}
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "space-around",
                    }}
                  >
                    <Grid
                      item
                      md={8}
                      sm={8}
                      lg={8}
                      xs={8}
                      sx={{
                        paddingTop: "0.5em",
                        paddingBottom: "0.5em",
                        paddingLeft: "0.5em",
                        wordBreak: "break-all",
                      }}
                      onClick={() => {
                        setMailData(mailData?.body?.content);
                      }}
                    >
                      <Grid>{mailData?.sender?.emailAddress?.address}</Grid>
                      <Grid>{mailData?.subject}</Grid>
                    </Grid>
                    <Grid
                      item
                      md={4}
                      sm={4}
                      lg={4}
                      xs={4}
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
          <Grid item xs={8} sm={8} md={8} lg={8}>
            <div dangerouslySetInnerHTML={{ __html: mailData }} />
          </Grid>
        </Grid>
      </Grid>
      {/* : "" } */}
    </>
  );
}

export default Mails;
