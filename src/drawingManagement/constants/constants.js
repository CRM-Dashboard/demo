import DashboardIcon from "@mui/icons-material/Dashboard";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt"; //info
import ApprovalIcon from "@mui/icons-material/Approval"; //certi

export const routes = [
  {
    path: "",
    to: "/drawing",
    name: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    path: "register",
    to: "/drawing",
    name: "Drawing Register",
    icon: <AppRegistrationIcon />,
  },
  {
    path: "rfi",
    to: "/drawing",
    name: "RFI",
    icon: <PsychologyAltIcon />,
  },
  {
    path: "transmittal",
    to: "/drawing",
    name: "Drawing Transmittal",
    icon: <TransferWithinAStationIcon />,
  },
  {
    path: "certificate",
    to: "/drawing",
    name: "Architect Certificate",
    icon: <ApprovalIcon />,
  },
];
