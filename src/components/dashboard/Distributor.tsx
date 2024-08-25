import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../Layout";

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
      <Layout>
        <Typography>Welcome {distributor?.companyName}</Typography>
        {/* <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <QuickStats />
          </Grid>
          <Grid item xs={12} md={6}>
            <RecentActivities />
          </Grid>
          <Grid item xs={12} md={6}>
            <TopSellingItems />
          </Grid>
          <Grid item xs={12} md={6}>
            <LowStockAlerts />
          </Grid>
        </Grid> */}
      </Layout>
    </>
  );
};

export default Distributor;
