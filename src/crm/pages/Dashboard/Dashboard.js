import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PreEmi from "./PreEmi/PreEmi";
import CashBack from "./CashBack/CashBack";
import SAPEmail from "./SAPEmail/SAPEmail";
import OutlookMails from "./OutlookMails/OutlookMails";
import BookingDetails from "./BookingDetails/BookingDetails";
import { useSelector } from "react-redux/es/hooks/useSelector";
import CustomersList from "./CustomerInformation/CustomersList";
import CustomerDetails from "./CustomerDetails/CustomerDetails";
import InterestWaveOff from "./InterestWaveOff/InterestWaveOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BookingData from "./BookingDetails/BookingData/BookingData";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import InvoiceTable from "../Dashboard/InvoiceDetails/InvoiceTable";
import UnitCustomisation from "./UnitCustomisation/UnitCustomisation";
import PaymentDetails from "../Dashboard/PaymentDetails/PaymentDetails";
import InterestDetails from "../Dashboard/InterestDetails/InterestDetails";
import PaymentSchedule from "../Dashboard/PaymentSchedule/PaymentSchedule";
import CancellationRequest from "./CancellationRequest/CancellationRequest";

function Dashboard() {
  const [shoudldShowCustomerList, setShoudldShowCustomerList] = useState("");
  const [shouldShowBookingDetails, setShouldShowBookingDetails] = useState("");

  const reducerData = useSelector((state) => state);
  const orderId = reducerData?.searchBar.orderId;

  useEffect(() => {
    setShoudldShowCustomerList(reducerData.dashboard.shouldShowCustData);
  }, [reducerData.dashboard.shouldShowCustData]);

  useEffect(() => {
    setShouldShowBookingDetails(reducerData.dashboard.shouldShowBookingDetails);
  }, [reducerData.dashboard.shouldShowBookingDetails]);

  const tabs = [
    {
      label: "Home",
      component: <CustomerDetails />,
    },
    {
      label: "Payment Schedule",
      component: <PaymentSchedule />,
    },

    {
      label: "Invoice Details",
      component: <InvoiceTable />,
    },
    {
      label: "Payment Details",
      component: <PaymentDetails />,
    },
    {
      label: "Interest Details",
      component: <InterestDetails />,
    },
    {
      label: "Pre-EMI/Rental",
      component: <PreEmi />,
    },
    {
      label: "Cashback ",
      component: <CashBack />,
    },
    {
      label: "Interest Waveoff",
      component: <InterestWaveOff />,
    },
    {
      label: "Cancellation Request",
      component: <CancellationRequest />,
    },
    {
      label: "Unit Customisation",
      component: <UnitCustomisation />,
    },
    {
      label: "SAP Email",
      component: <SAPEmail />,
    },
    {
      label: "Outlook Email",
      component: <OutlookMails />,
    },
  ];

  const getMuiTheme = () =>
    createTheme({
      MuiTabs: {
        styleOverrides: {
          root: {
            display: "flex",
            height: "2em",
          },
        },
      },
    });

  return (
    <Box>
      <ThemeProvider theme={() => getMuiTheme()}>
        {
          !shoudldShowCustomerList && !shouldShowBookingDetails ? (
            <CustomTabLayout tabPanels={tabs} /> // Dashboard Data
          ) : shoudldShowCustomerList ? (
            <CustomersList /> // Applicants Data
          ) : orderId ? (
            <BookingDetails />
          ) : (
            <BookingData />
          ) //Booking details if orderId set
        }
      </ThemeProvider>
    </Box>
  );
}

export default Dashboard;
