/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Grid,
  List,
  Button,
  ListItem,
  Checkbox,
  Collapse,
  MenuItem,
  ListItemText,
  Autocomplete,
} from "@mui/material";
import Parking from "./Parking";
import Booking from "./Booking";
import Payment from "./Payment";
import Invoices from "./Invoices";
import Outstanding from "./Outstanding";
import Registration from "./Registration";
import { useDispatch, useSelector } from "react-redux";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BookingAction from "./BookingReducer/BookingAction";
import InputField from "../../../../components/inputField/InputField";
import CustomTabLayout from "../../../../components/tabs/CustomTabLayout";
import CircularScreenLoader from "../../../../components/circularScreenLoader/CircularScreenLoader";

export default function BookingData() {
  const dispatch = useDispatch();
  const reducerData = useSelector((state) => state);
  const crmId = reducerData.dashboard.crmId;
  const OrderId = reducerData.searchBar.orderId;
  const passWord = reducerData.LoginReducer.passWord;
  const userName = reducerData.LoginReducer.userName;
  const projectId = reducerData?.dashboard?.project?.projectId;
  const bookingsFilters = reducerData?.BookingReducer?.BookingsDetailsFilter;

  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    Registration_status: [],
    Confirmation_status: [],
    Possession_status: [],
    Property_type: "",
    Building: "",
    Unit_Number: "",
    CrmData: [],
  });
  const [open, setOpen] = useState({
    Registration_status: true,
    Confirmation_status: true,
    Possession_status: true,
    Property_type: true,
  });
  const [itemGroups, setItemGroups] = useState({
    Registration_status: [],
    Confirmation_status: [],
    Possession_status: [],
    Building: [],
    Unit_Number: [],
    Property_type: [],
    CrmData: [],
  });

  function getUniqueStatuses(data) {
    const registrationStatusSet = new Set();
    const confirmationStatusSet = new Set();
    const possessionStatusSet = new Set();
    const propertyTypeSet = new Set();
    const unitNumberSet = new Set();
    const buildingSet = new Set();
    const crmDataSet = new Set();

    data.forEach((item) => {
      if (item.regStatus) registrationStatusSet.add(item.regStatus);
      if (item.confStatus) confirmationStatusSet.add(item.confStatus);
      if (item.possStatus) possessionStatusSet.add(item.possStatus);
      if (item.building) buildingSet.add(item.building);
      if (item.flatno) unitNumberSet.add(item.flatno);
      if (item.property) propertyTypeSet.add(item.property);
      if (item.crmid) crmDataSet.add(item.crmid);
    });

    const itemGroups = {
      Registration_status: Array.from(registrationStatusSet),
      Confirmation_status: Array.from(confirmationStatusSet),
      Possession_status: Array.from(possessionStatusSet),
      Property_type: Array.from(propertyTypeSet),
      Unit_Number: Array.from(unitNumberSet),
      Building: Array.from(buildingSet),
      CrmData: Array.from(crmDataSet),
    };

    console.log("#######itemGroups", itemGroups);

    setItemGroups(itemGroups);
  }

  const handleDropdownChange = (group, value) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [group]: value,
    }));
  };

  const handleToggle = (group, value) => {
    const currentIndex = selectedItems[group].indexOf(value);
    const newChecked = [...selectedItems[group]];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedItems((prevState) => ({
      ...prevState,
      [group]: newChecked,
    }));
  };

  const handleClick = (group) => {
    setOpen((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

  // const getFilteredData = (data) => {
  //   const { Registration_status, Confirmation_status, Possession_status } =
  //     bookingsFilters;

  //   if (
  //     Registration_status.length === 0 &&
  //     Confirmation_status.length === 0 &&
  //     Possession_status.length === 0
  //   ) {
  //     return response;
  //   }

  //   // Helper function to check if a filter group has mutually exclusive selections
  //   const hasMutuallyExclusiveSelections = (filterGroup) => {
  //     return filterGroup.length > 1;
  //   };

  //   // Check if there are mutually exclusive selections in Registration_status
  //   if (hasMutuallyExclusiveSelections(Registration_status)) {
  //     return [];
  //   }

  //   // Check if there are mutually exclusive selections in Confirmation_status
  //   if (hasMutuallyExclusiveSelections(Confirmation_status)) {
  //     return [];
  //   }

  //   // Check if there are mutually exclusive selections in Possession_status
  //   if (hasMutuallyExclusiveSelections(Possession_status)) {
  //     return [];
  //   }

  //   let filteredData = data;

  //   if (Registration_status.length > 0) {
  //     filteredData = filteredData.filter((item) =>
  //       Registration_status.includes(item.regStatus)
  //     );
  //   }

  //   // Filter by Confirmation_status if any values are selected
  //   if (Confirmation_status.length > 0) {
  //     filteredData = filteredData.filter((item) =>
  //       Confirmation_status.includes(item.confStatus)
  //     );
  //   }

  //   // Filter by Possession_status if any values are selected
  //   if (Possession_status.length > 0) {
  //     filteredData = filteredData.filter((item) =>
  //       Possession_status.includes(item.possStatus)
  //     );
  //   }

  //   setTableData(filteredData);

  //   return filteredData;
  // };

  const getFilteredData = (data) => {
    const {
      Registration_status,
      Confirmation_status,
      Possession_status,
      Building,
      Unit_Number,
      Property_type,
      CrmData,
    } = bookingsFilters;

    if (
      Registration_status?.length === 0 &&
      Confirmation_status?.length === 0 &&
      Possession_status?.length === 0 &&
      CrmData?.length === 0 &&
      !Building &&
      !Unit_Number &&
      !Property_type
    ) {
      return response;
    }

    // Helper function to check if a filter group has mutually exclusive selections
    const hasMutuallyExclusiveSelections = (filterGroup) => {
      return filterGroup?.length > 1;
    };

    // Check if there are mutually exclusive selections in Registration_status
    if (hasMutuallyExclusiveSelections(Registration_status)) {
      return [];
    }

    // Check if there are mutually exclusive selections in Confirmation_status
    if (hasMutuallyExclusiveSelections(Confirmation_status)) {
      return [];
    }

    // Check if there are mutually exclusive selections in Possession_status
    if (hasMutuallyExclusiveSelections(Possession_status)) {
      return [];
    }

    let filteredData = data;

    if (Registration_status?.length > 0) {
      filteredData = filteredData.filter((item) =>
        Registration_status.includes(item.regStatus)
      );
    }

    if (Confirmation_status?.length > 0) {
      filteredData = filteredData.filter((item) =>
        Confirmation_status.includes(item.confStatus)
      );
    }

    if (Possession_status?.length > 0) {
      filteredData = filteredData.filter((item) =>
        Possession_status.includes(item.possStatus)
      );
    }

    if (CrmData?.length > 0) {
      filteredData = filteredData.filter((item) => item.crmid === CrmData);
    }

    if (Building) {
      filteredData = filteredData.filter((item) => item.building === Building);
    }

    if (Unit_Number) {
      filteredData = filteredData.filter((item) => item.flatno === Unit_Number);
    }

    if (Property_type) {
      filteredData = filteredData.filter(
        (item) => item.property === Property_type
      );
    }

    setTableData(filteredData);

    return filteredData;
  };

  const tabs = [
    {
      label: "Booking Details",
      component: (
        <Booking
          tableDetails={tableData}
          response={response}
          getFilteredData={getFilteredData}
        />
      ),
    },
    {
      label: "Registration Details",
      component: (
        <Registration
          tableDetails={tableData}
          response={response}
          getFilteredData={getFilteredData}
        />
      ),
    },
    {
      label: "Invoice Details",
      component: (
        <Invoices
          tableDetails={tableData}
          response={response}
          getFilteredData={getFilteredData}
        />
      ),
    },
    {
      label: "Payment Details",
      component: (
        <Payment
          tableDetails={tableData}
          response={response}
          getFilteredData={getFilteredData}
        />
      ),
    },
    {
      label: "Outstanding Details",
      component: (
        <Outstanding
          tableDetails={tableData}
          response={response}
          getFilteredData={getFilteredData}
        />
      ),
    },
    {
      label: "Parking Details",
      component: (
        <Parking
          tableDetails={tableData}
          response={response}
          getFilteredData={getFilteredData}
        />
      ),
    },
  ];

  const getTableData = () => {
    const formData = new FormData();
    formData.append("crmId", crmId);
    formData.append("orderId", OrderId);
    formData.append("userName", userName);
    formData.append("passWord", passWord);
    formData.append("projectId", projectId);

    setLoading(true);

    fetch(process.env.REACT_APP_SERVER_URL + "/api/dashboard/so_list", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setResponse(data[0].orderdata);
          setTableData(data[0].orderdata);
          getUniqueStatuses(data[0].orderdata);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getTableData();
  }, [crmId]);

  useEffect(() => {
    getTableData();
  }, []);

  useEffect(() => {
    dispatch(BookingAction.setBookingDetailsFilter(selectedItems));
    console.log("Selected Items:", selectedItems);
  }, [selectedItems]);

  return !loading ? (
    <Grid>
      <Grid container columns={12} spacing={1}>
        <Grid
          item
          xs={3}
          sm={3}
          md={3}
          lg={3}
          sx={{
            "&.MuiGrid-item": { paddingLeft: "0px" },
            display: "flex",
            flexDirection: "column",
            marginTop: "1em",
            backgroundColor: "white",
            paddingBottom: "2em",
            alignItems: "left",
            justifyContent: "left",
            height: "20%",
            border: "1px solid white",
            borderRadius: "18px",
            position: "sticky",
            top: "4em",
            alignSelf: "flex-start",
          }}
        >
          <Grid
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              color: "blue",
              padding: "0.2em",
            }}
          >
            <Button
              sx={{ cursor: "Pointer" }}
              onClick={() => {
                setSelectedItems({
                  Registration_status: [],
                  Confirmation_status: [],
                  Possession_status: [],
                  Property_type: "",
                  Building: "",
                  Unit_Number: "",
                });
                getTableData();
              }}
            >
              Clear ALL
            </Button>
          </Grid>
          {/* Dropdowns */}
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ margin: "0.2em" }}>
              <InputField
                select
                label={"Building"}
                value={selectedItems.Building}
                onChange={(e) =>
                  handleDropdownChange("Building", e.target.value)
                }
              >
                <MenuItem value="">Select Building</MenuItem>
                {itemGroups.Building.map((building) => (
                  <MenuItem key={building} value={building}>
                    {building}
                  </MenuItem>
                ))}
              </InputField>
            </Grid>
            <Grid item xs={12} style={{ margin: "0.2em" }}>
              <Autocomplete
                label="Flat Number"
                value={selectedItems.Unit_Number}
                onChange={(event, newValue) =>
                  handleDropdownChange("Unit_Number", newValue)
                }
                options={[...itemGroups.Unit_Number].sort((a, b) =>
                  b.localeCompare(a)
                )}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <InputField
                    {...params}
                    label="Flat Number"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} style={{ margin: "0.2em" }}>
              <InputField
                select
                label={"Property Type"}
                value={selectedItems.Property_type}
                onChange={(e) =>
                  handleDropdownChange("Property_type", e.target.value)
                }
              >
                <MenuItem value="">Select Property Type</MenuItem>
                {itemGroups.Property_type.map((property) => (
                  <MenuItem key={property} value={property}>
                    {property}
                  </MenuItem>
                ))}
              </InputField>
            </Grid>
            <Grid item xs={12} style={{ margin: "0.2em" }}>
              <InputField
                select
                label={"CRM"}
                value={selectedItems.CrmData}
                onChange={(e) =>
                  handleDropdownChange("CrmData", e.target.value)
                }
              >
                <MenuItem value="">Select CRM</MenuItem>
                {itemGroups.CrmData.map((crm) => (
                  <MenuItem key={crm} value={crm}>
                    {crm}
                  </MenuItem>
                ))}
              </InputField>
            </Grid>
          </Grid>

          {/* Existing Checkboxes */}
          {[
            "Registration_status",
            "Confirmation_status",
            "Possession_status",
          ].map((group) => (
            <List key={group}>
              <ListItem onClick={() => handleClick(group)}>
                <ListItemText primary={group.replace("_", " ")} />
                {open[group] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open[group]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {itemGroups[group].map((item) => {
                    const labelId = `checkbox-list-label-${item}`;

                    return (
                      <ListItem
                        key={item}
                        role={undefined}
                        dense
                        onClick={() => handleToggle(group, item)}
                      >
                        <Checkbox
                          edge="start"
                          checked={selectedItems[group].indexOf(item) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                        <ListItemText id={labelId} primary={item} />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </List>
          ))}
        </Grid>
        <Grid item sx={9} sm={9} md={9} lg={9}>
          <CustomTabLayout tabPanels={tabs} />
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <CircularScreenLoader />
  );
}
