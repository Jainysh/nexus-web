import { login } from "@/store/authSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type GlobalStateProps = {
  children: React.ReactNode;
};
const GlobalState = ({ children }: GlobalStateProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isDataLoading, setIsDataLoading] = useState(true);
  useEffect(() => {
    const loggedInPhoneNumber = localStorage.getItem("loggedInNumber");
    if (loggedInPhoneNumber) {
      dispatch(login({ primaryPhoneNumber: loggedInPhoneNumber }));
    }
    if (!isLoggedIn) {
      router.push("/login");
    }
    setIsDataLoading(false);
  }, []);
  return <>{!isDataLoading && children}</>;
};

export default GlobalState;
