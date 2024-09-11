import { getLoginUser } from "@/store/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type GlobalStateProps = {
  children: React.ReactNode;
};
const GlobalState = ({ children }: GlobalStateProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoggedIn, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(getLoginUser());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading]);

  return <>{children}</>;
};

export default GlobalState;
