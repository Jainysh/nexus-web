import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Distributor = () => {
  const router = useRouter();
  const { isLoggedIn, loggedInUser: distributor } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!distributor) {
      router.push("/login");
      return;
    }
  }, [router, distributor]);

  return (
    <>
      <Typography>Welcome {distributor?.companyName}</Typography>
    </>
  );
};

export default Distributor;
