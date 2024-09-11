import { logoutUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";

const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogOut = () => {
    const confirmation = confirm("Do you want to logout");
    if (confirmation) {
      dispatch(logoutUser());
    }
  };
  return {
    LogoutComponent: <Button onClick={handleLogOut}>Logout</Button>,
    handleLogOut,
  };
};
export default useLogout;
