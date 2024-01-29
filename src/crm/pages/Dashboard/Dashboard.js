import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CustomTabLayout from "../../components/tabs/CustomTabLayout";
import CustomerDetails from "./CustomerDetails/CustomerDetails";
import InvoiceTable from "../Dashboard/InvoiceDetails/InvoiceTable";
import PaymentDetails from "../Dashboard/PaymentDetails/PaymentDetails";
import ServiceRequest from "../Dashboard/ServiceRequest/ServiceRequest";
import EmailReport from "./EmailReport/EmailReport";
import InterestDetails from "../Dashboard/InterestDetails/InterestDetails";
import PreEmi from "./PreEmi/PreEmi";
import CashBack from "./CashBack/CashBack";
import InterestWaveOff from "./InterestWaveOff/InterestWaveOff";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomersList from "./CustomerInformation/CustomersList";
import PaymentSchedule from "../Dashboard/PaymentSchedule/PaymentSchedule";
import CancellationRequest from "./CancellationRequest/CancellationRequest";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Timeline from "./BookingDetails/Timeline";

function Dashboard() {
  const [shoudldShowCustomerList, setShoudldShowCustomerList] = useState("");
  const [shouldShowTimeLine, setShouldTimeLine] = useState("");
  const reducerData = useSelector((state) => state);

  useEffect(() => {
    setShoudldShowCustomerList(reducerData.dashboard.shouldShowCustData);
  }, [reducerData.dashboard.shouldShowCustData]);

  useEffect(() => {
    setShouldTimeLine(reducerData.dashboard.shouldShowTimeLine);
  }, [reducerData.dashboard.shouldShowTimeLine]);

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
      label: "Service Request",
      component: <ServiceRequest />,
    },
    {
      label: "Email Report",
      component: <EmailReport />,
    },
    {
      label: "Cancellation Request",
      component: <CancellationRequest />,
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
        {!shoudldShowCustomerList && !shouldShowTimeLine ? (
          <CustomTabLayout tabPanels={tabs} />
        ) : shoudldShowCustomerList ? (
          <CustomersList />
        ) : (
          <Timeline />
        )}
      </ThemeProvider>
    </Box>
  );
}

export default Dashboard;
