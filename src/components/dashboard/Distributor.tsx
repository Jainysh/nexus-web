import { Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Layout from "../Layout";

const Distributor = () => {
  const { user: distributor } = useSelector((state: RootState) => state.auth);

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
