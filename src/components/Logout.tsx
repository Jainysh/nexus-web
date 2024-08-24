import { logout } from "@/store/authSlice";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();
  const handleLogOut = () => {
    const confirmation = confirm("Do you want to logout");
    if (confirmation) {
      dispatch(logout());
    }
  };
  return <Button onClick={handleLogOut}>Logout</Button>;
};
export default Logout;
