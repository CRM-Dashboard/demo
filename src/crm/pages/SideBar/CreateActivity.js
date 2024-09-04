/* eslint-disable no-useless-concat */
/* eslint-disable no-unreachable */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import dayjs from "dayjs";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import { useDispatch } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { DatePicker } from "@mui/x-date-pickers";
import DeleteIcon from "@mui/icons-material/Delete";
import { Select, MenuItem, Button } from "@mui/material";
import GlobalFunctions from "./../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import searchbarActions from "./../SearchBar/SearchBarReducer/SearchBarActions";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import UseCustomSnackbar from "../../components/snackbar/UseCustomSnackBar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const CreateActivity = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const snackbar = UseCustomSnackbar();
  const reducerData = useSelector((state) => state);
  const Sid = reducerData.searchBar.sid;
  const orderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const activityInfo = reducerData.searchBar.activityData;
  const projectId = reducerData?.dashboard?.project?.projectId;

  const [data, setData] = useState([]);
  const [subActData, setSubActData] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: orderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create New Activity",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const handleAddRow = () => {
    const newRow = ["", "", "", "", "", "", "", "", ""];
    setData([...data, newRow]);
    dispatch(searchbarActions.setActivityData([...data, newRow]));
  };

  const handleCellEdit = (e, rowIndex, colIndex) => {
    const newData = [...data];
    if (colIndex === 1) {
      const subData = props.subActTypeData?.filter(
        (data) => data.actTyp == e.target.value
      );
      setSubActData({ ...subActData, [rowIndex]: subData });
      newData[rowIndex][2] = ""; // Clear sub-activity value
    }
    newData[rowIndex][colIndex] = e.target.value;
    setData(newData);
    dispatch(searchbarActions.setActivityData(newData));
  };

  function convertToArrayOfObjects(data, template) {
    return data?.map((arr, index) => {
      const obj = {};
      template.forEach((key, i) => {
        if (key === "vbeln") {
          obj[key] = orderId;
        } else if (key == "werks") {
          obj[key] = projectId;
        } else {
          obj[key] = arr[i] ? arr[i] : ""; // Assign value or default to empty string
        }
      });
      return obj;
    });
  }

  const handleDeleteRow = (setRows) => {
    const indices = selectedRows.map((obj) => obj.dataIndex);

    // Filter out rows whose indices are not present in the indices array
    const newData = data?.filter((_, index) => !indices.includes(index));
    setData(newData);
    dispatch(searchbarActions.setActivityData(newData));
    setRows([]);
    setSelectedRows([]);
  };

  const handleSetRows = (currentRowsSelected) => {
    //set rows to delete here
    setSelectedRows(currentRowsSelected);
    // const newData = data.filter((_, index) => !currentRowsSelected.includes(index));
    // setData(newData);
    // setSelectedRows([]);
  };

  const options = {
    selectableRows: "single",
    responsive: "vertical",
    onRowSelectionChange: handleSetRows,

    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <DeleteIcon
        selectedRows={selectedRows}
        onClick={() => handleDeleteRow(setSelectedRows)}
      />
    ),
    customToolbar: () => [
      <Button
        variant="contained"
        disableElevation
        disableFocusRipple
        size="small"
        onClick={handleAddRow}
        sx={{
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
          },
        }}
      >
        <AddIcon style={{ marginRight: "0.4em" }} />
        Add New Row
      </Button>,
      <Button
        variant="contained"
        disabled={btnLoading}
        disableElevation
        disableFocusRipple
        size="small"
        onClick={() => {
          createActivity();
        }}
        sx={{
          "&.MuiButton-root": {
            textTransform: "none",
            backgroundColor: "#228B22",
          },
          marginLeft: "1em",
          paddingLeft: "1em",
          opacity: props.disabledBtn ? "2em" : "",
          pointerEvents: props.disabledBtn ? "none" : "",
        }}
      >
        Save{" "}
      </Button>,
    ],
  };

  const columns = [
    {
      name: "Activity Mode",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="act_mode"
            name="act_mode"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 0);
            }}
          >
            {props.actModeData?.map((data) => {
              return <MenuItem value={data.mode}> {data.modeTxt}</MenuItem>;
            })}
          </Select>
        ),
      },
    },
    {
      name: "Activity",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="activityType"
            name="activityType"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 1);
              const subData = props.subActTypeData?.filter((data) => {
                return data.actTyp == e.target.value;
              });
              setSubActData(subData);
              // Clear sub-activity value if activity changes
              // handleCellEdit({ target: { value: "" } }, tableMeta.rowIndex, 2);
              handleCellEdit(e, tableMeta.rowIndex, 1);
            }}
          >
            <MenuItem value=""> {"Select Activity"} </MenuItem>
            {props.actTypeData.map((data) => {
              return <MenuItem value={data.typ}> {data.typTxt}</MenuItem>;
            })}
          </Select>
        ),
      },
    },
    {
      name: "Sub-Activity",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="subActivityType"
            name="subActivityType"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 2);
            }}
          >
            <MenuItem value=""> {"Select Activity"} </MenuItem>
            {subActData?.[tableMeta?.rowIndex]?.map((data) => {
              return (
                <MenuItem value={data.actSubtyp}> {data.actSubtypTxt}</MenuItem>
              );
            })}
          </Select>
        ),
      },
    },
    {
      name: "Disposition Code",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Select
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "4.5px 14px",
                font: "-webkit-control",
              },
            }}
            id="subActivityType"
            name="subActivityType"
            value={value}
            onChange={(e) => {
              handleCellEdit(e, tableMeta.rowIndex, 3);
            }}
          >
            <MenuItem value=""> {"Select Activity"} </MenuItem>
            {props.dpData.map((data) => {
              return <MenuItem value={data.dpCode}> {data.dpTxt}</MenuItem>;
            })}
          </Select>
        ),
      },
    },
    {
      name: "Action",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 4)}
          />
        ),
      },
    },
    {
      name: "Amount",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 5)}
          />
        ),
      },
    },
    {
      name: "Date",
      options: {
        customBodyRender: (value, tableMeta) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="erdat"
              value={dayjs(value)}
              onChange={(e) => {
                const dateEvent = {
                  target: {
                    value: e,
                  },
                };
                console.log(
                  "#########dateEvent",
                  dateEvent,
                  tableMeta.rowIndex
                );
                handleCellEdit(dateEvent, tableMeta.rowIndex, 6);
              }}
            />
          </LocalizationProvider>
        ),
      },
    },
    {
      name: "Time",
      options: {
        customBodyRender: (value, tableMeta) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileTimePicker
              id="time"
              name="time"
              label="Time"
              value={value}
              sx={{
                "&.MuiInputBase-input": {
                  height: "2em",
                  padding: 0,
                },
                width: "100%",
              }}
              onChange={(e) => {
                const dateEvent = {
                  target: {
                    value: e,
                  },
                };
                console.log(
                  "#########dateEvent",
                  dateEvent,
                  tableMeta.rowIndex
                );
                handleCellEdit(dateEvent, tableMeta.rowIndex, 7);
              }}
            />
          </LocalizationProvider>
        ),
      },
    },
    {
      name: "Remarks",
      options: {
        customBodyRender: (value, tableMeta) => (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(e, tableMeta.rowIndex, 8)}
          />
        ),
      },
    },
  ];

  const formatDateAndTime = (data) => {
    return data.map((item) => ({
      ...item,
      erdat: moment(item.erdat.$d).format("YYYY-MM-DD"),
      pltac: moment(item.pltac.$d).format("HH:mm:ss"),
    }));
  };

  const createActivity = () => {
    const template = [
      "act_mode",
      "act_typ",
      "act_subtyp",
      "dp_code",
      "action",
      "dmbtr",
      "erdat",
      "pltac",
      "remark",
      "vbeln",
      "werks",
    ];
    const updatedData = convertToArrayOfObjects(data, template);

    const dataToSave = formatDateAndTime(updatedData);
    console.log("##########dataToSave", dataToSave);

    setBtnLoading(true);
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(dataToSave));

    fetch(
      // "https://gera-crm-server.azurewebsites.net//api/activity/createActivity",
      `${process.env.REACT_APP_SERVER_URL}/api/activity/createActivity`,
      { method: "POST", body: formData }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          saveLog();
          props.setSid(0);
          props.setDisabledBtn(false);
          props.setCallAPI(false);
          snackbar.showSuccess("Activity created successfully!");
          dispatch(searchbarActions.setActivityData({}));
          dispatch(searchbarActions.setSid(""));
          props.setOpenActivityModal(false);
        }
      })
      .catch((error) => {
        if (error) {
          snackbar.showError(
            "Error while creating activity. Please try again!"
          );
        }
      });
  };

  useImperativeHandle(ref, () => ({
    createActivity,
    // handleContinue,
  }));

  // const convertTime = (time24) => {
  //   // Splitting the time string into hours, minutes, and seconds
  //   const [hours, minutes, seconds] = time24.split(":");

  //   // Creating a Date object to format the time
  //   const time = new Date(0, 0, 0, hours, minutes, seconds);

  //   // Formatting the time into 12-hour clock format
  //   // const time12 = time.toLocaleString("en-US", {
  //   //   hour: "numeric",
  //   //   minute: "2-digit",
  //   //   second: "2-digit",
  //   //   hour12: true,
  //   // });

  //   // Formatting the time into the specified format
  //   const formattedTime = time.toISOString().slice(0, -5) + "Z";

  //   return formattedTime;
  // };

  // const getCurrentActType = (actTyp) => {
  //   const filteredData = props.actTypeData?.filter((actData) => {
  //     if (actData.typ === activityInfo?.act_typ) {
  //       return actData.typTxt;
  //     }
  //   });
  //   return filteredData;
  // };

  useEffect(() => {
    if (activityInfo.length > 0) {
      const tempSubActData = {};
      const formattedData = activityInfo.map((row, index) => {
        const actTyp =
          props.actTypeData.find((item) => item.typ === row[1])?.typ || "";
        const actSubtyp =
          props.subActTypeData.find(
            (item) => item.actSubtyp === row[2] && item.actTyp === row[1]
          )?.actSubtyp || "";
        const subData = props.subActTypeData.filter(
          (sActdata) => sActdata.actTyp === row[1]
        );
        tempSubActData[index] = subData;

        return [
          row[0], // act_mode
          actTyp, // act_typ
          actSubtyp, // act_subtyp
          row[3], // dp_code
          row[4], // action
          row[5], // dmbtr
          row[6], // erdat
          row[7], // pltac
          row[8], // remark
        ];
      });
      setSubActData(tempSubActData);
      setData(formattedData);
    }

    if (Sid) {
      props.setDisabledBtn(false);
    } else {
      props.setDisabledBtn(true);
    }
  }, [activityInfo]);

  return (
    <div style={{ marginTop: "1em" }}>
      <MUIDataTable
        title={"Create Activity"}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
});

export default CreateActivity;
