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
import { useFormik } from "formik";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Grid, Box, Typography, MenuItem } from "@mui/material";
import InputField from "../../../components/inputField/InputField";
import CrmDatePicker from "../../../components/crmDatePicker/CrmDatePicker";
import UseCustomSnackbar from "../../../components/snackbar/UseCustomSnackBar";

const CreatePreEmiReceipt = forwardRef((props, ref) => {
  // const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [schemeStart, setSchemeStart] = useState(null);
  const [schemeEnd, setSchemeEnd] = useState(null);
  const [soDetails, setSoDetails] = useState("");

  const reducerData = useSelector((state) => state);
  const OrderId = reducerData.searchBar.orderId;
  const projectId = reducerData.dashboard.project.projectId;
  const custData = reducerData.searchBar.accountStatement;
  const snackbar = UseCustomSnackbar();

  useEffect(() => {
    if (OrderId) {
      fetch(`/sap/bc/react/crm/so?sap-client=250&vbeln=${OrderId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Bookig Data@@@@@@@@@@@", data[0].vbeln);
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
              console.log(
                "###############scheme",
                data[0].schemeStart,
                data[0].schemeEnd
              );
            }
          }
        });
    }
  }, []);

  const saveReceipt = () => {
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
      spmon: moment(formik.values.month).format("YYYYMM"),
    };
    console.log("######entryData,errors", entryData, formik.errors);

    if (Object.keys(formik.errors).length === 0) {
      fetch(`/sap/bc/react/crm/repay_create?sap-client=250`, {
        method: "POST",
        body: JSON.stringify(entryData),
        headers: {
          Accept: "application/json",
          Origin: "http://115.124.113.252:8000/",
          Referer: "http://115.124.113.252:8000/",
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            snackbar.showSuccess(
              "Pre EMI/ Rental receipt created successfully!"
            );
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
    schemeStart: yup.date(),
    schemeEnd: yup.date(),
    repayType: yup.string().required("Required"),
    month: yup.string().required("Required"),
    amount: yup.number().required("Required"),
    onBehalf: yup.string(),
    onBehalfPan: yup.string(),
    remarks: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      schemeStart: schemeStart,
      schemeEnd: schemeEnd,
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
    console.log("!!!!!!!!!!start", startDate);
    console.log("!!!!!!!!!!end", endDate);
    console.log("!!!!!!!!!!current", currentDate);
    const result = currentDate > startDate && currentDate < endDate;

    // Check if the currentDate is between the startDate and endDate
    if (currentDate > startDate && currentDate < endDate) {
      console.log("In Range!!!!!!!!!!");
    } else {
      formik.setFieldError(
        "month",
        "Month should be in Range of start scheme and end scheme."
      );
    }
  }, [formik.values.month]);

  const handleFileUpload = (event) => {
    console.log("#######event.target.files", event.target.files);
    const files1 = event.target.files;
    const filesArray = Array.from(files1);
    // setFiles((prevArray) => prevArray.concat(filesArray));
    console.log(
      "#######event.target.filesArray",
      files,
      filesArray,
      filesArray.length
    );
    // console.log("#######apended files", [...files, ...filesArray]);
    setFiles([...files, ...filesArray]);
    const finalFiles = [...files, ...filesArray];

    console.log("#######finalFiles", finalFiles);
    // Convert each file to base64
    Promise.all(finalFiles.map((file) => readFileAsBase64(file)))
      .then((base64Array) => {
        console.log("base64Array######", base64Array);
        // setSelectedFile(base64Array);
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
              // onChange={(value) =>
              //   formik.setFieldValue("schemeStart", value, true)
              // }
              error={
                formik.touched.schemeStart && Boolean(formik.errors.schemeStart)
              }
              helperText={
                formik.touched.schemeStart && formik.errors.schemeStart
              }
              disabled
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <CrmDatePicker
              name="schemeEnd"
              label="Scheme End"
              value={dayjs(schemeEnd)}
              // onChange={(value) =>
              //   formik.setFieldValue("schemeEnd", value, true)
              // }
              error={
                formik.touched.schemeEnd && Boolean(formik.errors.schemeEnd)
              }
              helperText={formik.touched.schemeEnd && formik.errors.schemeEnd}
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
              required
            />
          </Grid>
          <Grid item xs={4} sm={6} md={6}>
            <InputField
              id="onBehalf"
              name="onBehalf"
              label="On Behalf"
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
              onChange={formik.handleChange}
            />
          </Grid>
        </Grid>
        <br />

        {/* {
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
                  {<LinearProgress variant="determinate" value={100} />}
                </div>
              );
            })}
          </Grid>
        } */}
      </Box>
    </formik>
  );
});

export default CreatePreEmiReceipt;
