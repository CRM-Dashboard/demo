import CampaignIcon from "@mui/icons-material/Campaign";
import BarChartIcon from "@mui/icons-material/BarChart";

export const routes = [
  {
    path: "",
    to: "/campaign",
    name: "Campaign",
    icon: <CampaignIcon />,
  },
  {
    path: "analysis",
    to: "/campaign",
    name: "Analysis",
    icon: <BarChartIcon />,
  },
];
