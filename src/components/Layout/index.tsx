import React from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./Sidebar";
import BottomTab from "./BottomTab";

type LayoutProps = {
  children: React.ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div>
      {!isMobile && <Sidebar />}
      <main style={{ marginLeft: "56px" }}>{children}</main>
      {isMobile && <BottomTab />}
    </div>
  );
};

export default Layout;
