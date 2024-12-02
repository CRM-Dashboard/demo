import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";

function CustomTabs({
  tabs,
  defaultTab = 0,
  onChange,
  variant = "standard",
  centered = false,
  tabStyle = {},
  tabsWrapperStyle = {},
  contentWrapperStyle = {},
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <Box>
      {/* Tabs Header */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant={variant}
        centered={centered}
        sx={{ ...tabsWrapperStyle }}
        aria-label="custom tabs"
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon || null}
            iconPosition="start"
            sx={{ ...tabStyle }}
          />
        ))}
      </Tabs>

      {/* Tab Content */}
      <Box mt={2} sx={{ ...contentWrapperStyle }}>
        {tabs[activeTab]?.content}
      </Box>
    </Box>
  );
}

export default CustomTabs;
