import { Home, Inventory, People, Person } from "@mui/icons-material";

export const SidebarItems = [
  { text: "Dashboard", icon: <Home />, link: "/dashboard" },
  { text: "Items", icon: <Inventory />, link: "/dashboard/items" },
  { text: "Parties", icon: <People />, link: "/dashboard/parties" },
  { text: "My Profile", icon: <Person />, link: "/dashboard/profile" },
];
