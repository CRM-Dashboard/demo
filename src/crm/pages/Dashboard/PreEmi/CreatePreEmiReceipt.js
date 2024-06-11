/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import dayjs from "dayjs";
import * as yup from "yup";
import moment from "moment";
import { Formik, useFormik } from "formik";
import GlobalFunctions from "./../../../utils/GlobalFunctions";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const CreatePreEmiReceipt = forwardRef((props, ref) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [schemeStart, setSchemeStart] = useState(null);
  const [schemeEnd, setSchemeEnd] = useState(null);
  const [soDetails, setSoDetails] = useState("");
  const [error, setError] = useState("");

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const projectId = reducerData.dashboard.project.projectId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const custData = reducerData.searchBar.accountStatement;
  const snackbar = UseCustomSnackbar();

  useEffect(() => {
    if (OrderId) {
      const formData = new FormData();
      formData.append("orderId", OrderId);
      formData.append("userName", userName);
      formData.append("passWord", passWord);

      fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data[0].vbeln) {
            setSoDetails(data);
            if (
              data[0].schemeStart === "0000-00-00" ||
              data[0].schemeEnd === "0000-00-00"
            ) {
              props.setopenCreateForm(false);
              snackbar.showError(
                "Please set Scheme start and Scheme end date!"
              );
              setSchemeEnd(null);
              setSchemeStart(null);
            } else {
              setSchemeEnd(data[0].schemeEnd);
              setSchemeStart(data[0].schemeStart);
            }
          }
        });
    }
  }, []);

  const saveLog = async () => {
    const now = new Date();
    const entryData = {
      OBJECTID: OrderId,
      USERNAME: userName.toUpperCase(),
      UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
      UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
      OBJECT: "Create Pre Emi / Rental Assurance",
      CHANGEIND: "I",
      VALUE_OLD: {},
      VALUE_NEW: {},
    };

    await GlobalFunctions.saveLog(userName, passWord, entryData);
  };

  const saveReceipt = () => {
    console.log(
      "formik.values.month########",
      moment(formik.values.month?.$d).format("YYYYMM")
    );
    const entryData = {
      vbeln: OrderId,
      pmt_req_typ: formik.values.repayType,
      werks: projectId,
      building: soDetails[0].building,
      unit: soDetails[0].flatno,
      proj_name: soDetails[0].project,
      cust_name: custData.CustomerName,
      amount: formik.values.amount,
      remark: formik.values.remarks,
      onbehalf: formik.values.onBehalf,
      panno: formik.values.onBehalfPan,
      spmon: moment(formik.values.month?.$d).format("YYYYMM"),
      // files:[]
    };

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("entryData", JSON.stringify(entryData));

    // eslint-disable-next-line eqeqeq
    if (Object.keys(formik.errors).length === 0 && error !== "Required") {
      fetch(
        process.env.REACT_APP_SERVER_URL + `/api/dashboard/preEmi/create_repay`,
        {
          method: "POST",
          body: formData,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            saveLog();
            snackbar.showSuccess(
              "Pre EMI/ Rental receipt created successfully!"
            );
            setError("");
            props.setopenCreateForm(false);
            props.getTableData();
          }
        })
        .catch((error) => {
          if (error) {
            snackbar.showError(
              "Error while creating Pre EMI/ Rental receipt. Please try again!"
            );
            props.setopenCreateForm(false);
          }
        });
    }
  };

  useImperativeHandle(ref, () => ({
    saveReceipt,
  }));

  const validationSchema = yup.object({
    schemeStart: yup.string(),
    schemeEnd: yup.string(),
    repayType: yup.string().required("Required"),
    month: yup.string().required("Required"),
    amount: yup.number().required("Required"),
    onBehalf: yup.string(),
    onBehalfPan: yup.string(),
    remarks: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      schemeStart: dayjs(schemeStart),
      schemeEnd: dayjs(schemeEnd),
      repayType: "",
      month: null,
      amount: "",
      onBehalf: "",
      onBehalfPan: "",
      remarks: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const data = values;
      saveReceipt(data);
    },
  });

  useEffect(() => {
    const inputDate = new Date(formik.values.month);

    const currentDate = new Date(inputDate);

    // Convert the start and end range to JavaScript Date objects
    const startDate = new Date(schemeStart);
    const endDate = new Date(schemeEnd);
    const result = currentDate > startDate && currentDate < endDate;

    // Check if the currentDate is between the startDate and endDate
    if (result) {
      setError("");
    } else {
      formik.setFieldError(
        "month",
        "Month should be in Range of start scheme and end scheme."
      );
      setError("Required");
      snackbar.showError(
        "Month should be in Range of start scheme and end scheme."
      );
    }
  }, [formik.values.month]);

  const handleFileUpload = (event) => {
    const files1 = event.target.files;
    const filesArray = Array.from(files1);
    setFiles((prevArray) => prevArray.concat(filesArray));

    setFiles([...files, ...filesArray]);
    const finalFiles = [...files, ...filesArray];

    // Convert each file to base64
    Promise.all(finalFiles.map((file) => readFileAsBase64(file)))
      .then((base64Array) => {
        console.log("base64Array######", base64Array);
        setSelectedFile(base64Array);
      })
      .catch((error) => {
        console.error("Error reading files#######:", error);
      });
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const fileBlob = new Blob([file], { type: file.type });

      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(fileBlob);
    });
  };

  return (
    <formik>
      <Box sx={{ paddingTop: "1.5em" }}>
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="schemeStart"
              name="schemeStart"
              label="Scheme Start"
              value={dayjs(schemeStart)}
              error={Boolean(formik.errors.schemeStart)}
              helperText={formik.errors.schemeStart}
              disabled
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              name="schemeEnd"
              label="Scheme End"
              value={dayjs(schemeEnd)}
              error={Boolean(formik.errors.schemeEnd)}
              helperText={formik.errors.schemeEnd}
              disabled
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              select
              id="repayType"
              name="repayType"
              label="Repay Type"
              value={formik.values.repayType}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.repayType)}
              helperText={formik.errors.repayType}
              required
            >
              <MenuItem> {"Select Repay Type"} </MenuItem>

              <MenuItem value={1} key="Pre EMI">
                Pre EMI
              </MenuItem>
              <MenuItem value={2} key="Rental Assurance">
                Rental Assurance
              </MenuItem>
            </InputField>
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              id="month"
              name="month"
              label="Month"
              format="MMMM YYYY"
              views={["month", "year"]}
              value={formik.values.month}
              onChange={(value) => formik.setFieldValue("month", value, true)}
              error={Boolean(formik.errors.month)}
              helperText={formik.errors.month}
              isRequired
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="amount"
              name="amount"
              label="Amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.amount)}
              helperText={formik.errors.amount}
              required
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="onBehalf"
              name="onBehalf"
              label="On Behalf"
              error={Boolean(formik.errors.onBehalf)}
              helperText={formik.errors.onBehalf}
              value={formik.values.onBehalf}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        <Grid container spacing={4}>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="onBehalfPan"
              name="onBehalfPan"
              label="On Behalf PAN"
              value={formik.values.onBehalfPan}
              error={Boolean(formik.errors.onBehalfPan)}
              helperText={formik.errors.onBehalfPan}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <Typography style={{ fontSize: "0.8em" }}>Remarks</Typography>
            <textarea
              id="remarks"
              name="remarks"
              label="Remarks"
              style={{ width: "25.5em" }}
              value={formik.values.remarks}
              error={Boolean(formik.errors.remarks)}
              helperText={formik.errors.remarks}
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        {
          <input
            type="file"
            onChange={(event) => {
              handleFileUpload(event);
            }}
          />
        }
        {
          <Grid>
            {files?.map((file) => {
              return (
                <div>
                  {file.name}{" "}
                  {/* {<LinearProgress variant="determinate" value={100} />} */}
                </div>
              );
            })}
          </Grid>
        }
      </Box>
    </formik>
  );
});

export default CreatePreEmiReceipt;
