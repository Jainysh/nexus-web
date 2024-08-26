import { login } from "@/store/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type GlobalStateProps = {
  children: React.ReactNode;
};
const GlobalState = ({ children }: GlobalStateProps) => {
  const dispatch = useDispatch();
  const [isDataLoading, setIsDataLoading] = useState(true);
  useEffect(() => {
    const loggedInPhoneNumber = localStorage.getItem("loggedInNumber");
    if (loggedInPhoneNumber) {
      dispatch(login({ primaryPhoneNumber: loggedInPhoneNumber }));
    }
    setIsDataLoading(false);
  }, []);
  return <>{!isDataLoading && children}</>;
};

export default GlobalState;
