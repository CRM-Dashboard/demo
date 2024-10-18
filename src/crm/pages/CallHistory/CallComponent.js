import axios from "axios";
import React, { useEffect, useState, memo, useMemo } from "react";
import withTable from "../../components/TableFilter/withTable";
import TableFilter from "../../components/TableFilter/TableFilter";
import ReactPlayer from "react-player";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { useSelector } from "react-redux";

const HOCTable = withTable(memo(TableFilter));

const CallComponent = ({ callType, number }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [recordingId, setRecordingId] = useState();
    const [recordingUrl, setRecordingUrl] = useState("");

    const reducerData = useSelector((state) => state);
    const orderId = reducerData.searchBar.orderId;
    const passWord = reducerData.LoginReducer.passWord;
    const userName = reducerData.LoginReducer.userName;

    const getData = async () => {
        try {
            let dataUrl = "";
            const formData = new FormData();

            if (callType === "MyIncoming") {
                dataUrl = `${process.env.REACT_APP_SERVER_URL}/api/exotel/calls`;
                formData.append("To", number)
            }
            if (callType === "MyOutgoing") {
                dataUrl = `${process.env.REACT_APP_SERVER_URL}/api/exotel/IncomingCalls`
                formData.append("From", number)
            }
            if (callType === "Incoming") {
                dataUrl = `${process.env.REACT_APP_SERVER_URL}/api/exotel/IncomingCalls`
                formData.append("From", number)
            }
            if (callType === "Outgoing") {
                dataUrl = `${process.env.REACT_APP_SERVER_URL}/api/exotel/calls`;
                formData.append("To", number)
            }
            if (callType === "SAPCall") {
                dataUrl = process.env.REACT_APP_SERVER_URL + "/api/topbar/getCallDetails"
                formData.append("orderId", orderId);
                formData.append("userName", userName);
                formData.append("passWord", passWord);
            }

            // const dataUrl = callType === "MyIncoming" ? `${process.env.REACT_APP_SERVER_URL}/api/exotel/calls` : `${process.env.REACT_APP_SERVER_URL}/api/exotel/IncomingCalls`

            //   formData.append(callType === "MyIncoming" ? "To" : "From", number);

            const res = (await axios.post(dataUrl, formData)).data;
            console.log("Response data:", res); // Debug log
            callType === "SAPCall" ? setData(res) : setData(res?.Calls);
        } catch (error) {
            setError(error?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const playRecording = async (recordingURL) => {
        try {
            const formData = new FormData();
            formData.append("base_url", recordingURL.replace("https://", ""));
            const response = await fetch(
                process.env.REACT_APP_SERVER_URL + `/api/exotel/recording`,
                { method: "POST", body: formData }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch recording");
            }

            const stream = await response.blob();
            const audioUrl = URL.createObjectURL(stream);
            setRecordingUrl(audioUrl);
        } catch (error) {
            console.error("Error playing recording:", error);
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "To",
                accessor: "To",
            },
            {
                Header: "From",
                accessor: "From",
            },
            {
                Header: "Status",
                accessor: "Status",
            },
            {
                Header: "StartTime",
                accessor: "StartTime",
            },
            {
                Header: "Recording",
                accessor: "RecordingUrl",
                Cell: ({ cell: { value } }) => {
                    console.log(value, "Recording URL value"); // Debug log

                    if (!value) {
                        return <span>No recording available</span>;
                    }

                    return (
                        <IconButton color="primary" size="small">
                            {recordingId === value ? (
                                <ReactPlayer
                                    url={recordingUrl}
                                    controls
                                    width="300px"
                                    height="50px"
                                />
                            ) : (
                                <PlayCircleOutlineIcon
                                    onClick={() => {
                                        setRecordingId(value);
                                        playRecording(value);
                                    }}
                                />
                            )}
                        </IconButton>
                    );
                },
            },
        ],
        [recordingId, recordingUrl]
    );

    const sapColumns = useMemo(
        () => [
            {
                Header: "To",
                accessor: "callTo",
            },
            {
                Header: "From",
                accessor: "callFrom",
            },
            {
                Header: "Status",
                accessor: "status",
            },
            {
                Header: "StartTime",
                accessor: "startTime",
            },
            {
                Header: "Recording",
                accessor: "recordingUrl",
                Cell: ({ cell: { value } }) => {
                    console.log(value, "Recording URL value"); // Debug log

                    if (!value) {
                        return <span>No recording available</span>;
                    }

                    return (
                        <IconButton color="primary" size="small">
                            {recordingId === value ? (
                                <ReactPlayer
                                    url={recordingUrl}
                                    controls
                                    width="300px"
                                    height="50px"
                                />
                            ) : (
                                <PlayCircleOutlineIcon
                                    onClick={() => {
                                        setRecordingId(value);
                                        playRecording(value);
                                    }}
                                />
                            )}
                        </IconButton>
                    );
                },
            },
        ],
        [recordingId, recordingUrl]
    );

    const memoizedData = useMemo(() => data, [data]);

    console.log(memoizedData, "shdghs")

    if (error) {
        return <h1>Something went wrong, please try again...</h1>;
    }

    console.log(memoizedData); // Debug log
    return (
        <>
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <HOCTable
                    columns={callType === "SAPCall" ? sapColumns : columns || []}
                    data={memoizedData}
                    pageSize={100}
                    select={false}
                    editable={false}
                    showFilter={true}
                    pagination={false}
                />
            )}
        </>
    );
};

export default memo(CallComponent);
