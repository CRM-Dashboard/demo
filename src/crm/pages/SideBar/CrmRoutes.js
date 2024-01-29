import InboxIcon from "@mui/icons-material/MoveToInbox";

export default function CrmRoutes() {
  return [
    {
      name: "Dashboard",
      to: "/crm",
      collapsed: false,
      icon: InboxIcon,
      children: [
        {
          name: "Customer Details",
          url: "/customerDetails",
        },
        // {
        //   name: strings.settings,
        //   to: "/system-profile/settings",
        //   isSub: true,
        //   collapsed: true,
        //   children: [
        //     {
        //       name: strings.gstPst,
        //       url: "/gst-&-pst",
        //     },
        //   ],
        // },
      ],
    },
  ];
}
