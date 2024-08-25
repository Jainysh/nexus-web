import React from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { SidebarItems } from "@/utils/sidebarItems";

const BottomTab = () => {
  const router = useRouter();

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={router.pathname}
        onChange={(event, newValue) => {
          router.push(newValue);
        }}
      >
        {SidebarItems.map((item) => (
          <BottomNavigationAction
            key={item.text}
            label={item.text}
            icon={item.icon}
            value={item.link}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomTab;
