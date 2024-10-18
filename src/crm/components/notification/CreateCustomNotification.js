import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { Grid, Box, MenuItem } from "@mui/material";
import GlobalFunctions from "../../../crm/utils/GlobalFunctions";
import InputField from "../../components/inputField/InputField";
import UseCustomSnackbar from "../snackbar/UseCustomSnackBar";
import axios from "axios";

const typeList = [
    { type: "I", typeTxt: "Information" },
    { type: "S", typeTxt: "Success" },
    { type: "W", typeTxt: "Waring" },
    { type: "E", typeTxt: "Error" },
];

const CreateCustomNotification = forwardRef((props, ref) => {
    const validationSchema = Yup.object().shape({
        message: Yup.string().required("Required"),

        // type: Yup.string().required("Required"),
    });

    const [crmId, setCrmId] = useState("");
    const [type, setType] = useState("");

    const snackbar = UseCustomSnackbar();
    const reducerData = useSelector((state) => state);
    const orderId = reducerData.searchBar.orderId;
    const passWord = reducerData.LoginReducer.passWord;
    const userName = reducerData.LoginReducer.userName;
    const [crmList, setCrmList] = useState([]);



    const saveLog = async () => {
        const now = new Date();
        const entryData = {
            OBJECTID: orderId,
            USERNAME: userName?.toUpperCase(),
            UDATE: now.toISOString().slice(0, 10).replace(/-/g, "-"),
            UTIME: now.toLocaleTimeString("en-GB", { hour12: false }), //24 hrs time
            OBJECT: `Custom Notification Created by ${userName}`,
            CHANGEIND: "I",
            VALUE_OLD: {},
            VALUE_NEW: {},
        };

        await GlobalFunctions.saveLog(userName, passWord, entryData);
    };

    const formik = useFormik({
        initialValues: {
            message: "",

            // type: "",    
        },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            // const data = values;
            createNotification();
        },
    });

    const getCrmList = async () => {
        try {
            const formData = new FormData();
            formData.append("userName", userName);
            formData.append("passWord", passWord);
            const res = (
                await axios.post(
                    process.env.REACT_APP_SERVER_URL + "/api/dashboard/getCrmManager",
                    formData
                )
            ).data;
            setCrmList(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCrmList();
    }, []);

    const createNotification = async () => {

        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("passWord", passWord);
        formData.append("orderId", orderId);

        const entryData = {
            type: type,
            assigned: crmId,
            message: formik.values.message,
            category: 2,
            categoryTxt: "Custom"
        }


        formData.append("entryData", JSON.stringify(entryData));

        try {
            const res = (
                await axios.post(
                    process.env.REACT_APP_SERVER_URL + "/api/topBar/createNotification",
                    formData
                )
            ).data;

            if (res) {
                saveLog()
                snackbar.showSuccess("Custom Notification Created successfully!");
                props.getData();
                props.setOpenCreateNotification(false);
            }
        } catch (error) {
            snackbar.showError("Failed to update records!");
            props.setOpenCreateNotification(false);
            console.log(error, "err");
        }
    };

    useImperativeHandle(ref, () => ({
        createNotification: formik.handleSubmit,
    }));

    return (
        <form onSubmit={formik.handleSubmit}>

            <Box sx={{ paddingTop: "0.5em" }}>

                <Grid container spacing={2}>


                    <Grid item xs={12} md={12} xl={12}>
                        <InputField
                            sx={{ width: "100%" }}
                            select
                            id="type"
                            name="type"
                            label="Type"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                // setSelectedCRM(e.target.value);
                            }}
                        >
                            <MenuItem value="">{"Select Type"}</MenuItem>
                            {typeList?.map(({ type, typeTxt }) => (
                                <MenuItem value={type} key={type}>
                                    {typeTxt}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>

                    <Grid item xs={12}>
                        <InputField
                            id="message"
                            name="message"
                            label="Message"
                            value={formik.values.message}
                            onChange={formik.handleChange}
                            error={Boolean(formik.errors.message)}
                            helperText={formik.errors.message}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} md={12} xl={12}>
                        <InputField
                            sx={{ width: "100%" }}
                            select
                            id="crm"
                            name="crm"
                            label="CRM"
                            value={crmId}
                            onChange={(e) => {
                                setCrmId(e.target.value);
                                // setSelectedCRM(e.target.value);
                            }}
                        >
                            <MenuItem value="">{"Select CRM"}</MenuItem>
                            {crmList?.map((crm) => (
                                <MenuItem value={crm.crmId} key={crm.name}>
                                    {crm.name}
                                </MenuItem>
                            ))}
                        </InputField>
                    </Grid>
                </Grid>
            </Box>
        </form>
    );
});

export default CreateCustomNotification;
