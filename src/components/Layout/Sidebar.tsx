import React, { useEffect, useState } from "react";
import { Box, Drawer, List, ListItemButton, Typography } from "@mui/material";

import { ExitToApp } from "@mui/icons-material";
import Link from "next/link";
import { SidebarItems } from "@/utils/sidebarItems";
import useLogout from "../../hooks/useLogout";
import BrandIcon from "../icons/BrandIcon";

const Sidebar = () => {
  const { handleLogOut } = useLogout();
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen((isOpen) => !isOpen);
  const [path, setPath] = useState("");
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true}
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
    >
      <List>
        <ListItemButton
          aria-label="open drawer"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <BrandIcon />
          {open && <Typography sx={{ ml: 2 }}>Nexus</Typography>}
        </ListItemButton>
        {SidebarItems.map((item) => (
          <ListItemButton
            selected={path === item.link}
            key={item.text}
            component={Link}
            href={item.link}
            sx={{ mb: "2px" }}
          >
            {item.icon}
            {open && <Typography sx={{ mx: 2 }}>{item.text} </Typography>}
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: "auto" }}>
        <ListItemButton onClick={handleLogOut} sx={{ mb: "8px" }}>
          <ExitToApp />
          {open && <Typography sx={{ mx: 2 }}>Logout</Typography>}
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
