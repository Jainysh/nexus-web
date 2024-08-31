import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  useMediaQuery,
  Theme,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import useLogout from "@/hooks/useLogout";
import Layout from "@/components/Layout";
import { Party } from "@/types/common";

const Profile = () => {
  const user = useSelector(
    (state: RootState) => state.auth.loggedInUser
  ) as Party;
  const { handleLogOut } = useLogout();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <Box my={isMobile ? 1 : 2}>
      <Typography variant="subtitle1" fontWeight="bold">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  );

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ mt: 4, p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            My Profile
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InfoItem label="Company Name" value={user.companyName} />
              <InfoItem label="Phone Number" value={user.primaryPhoneNumber} />
              <InfoItem label="Type" value={user.type} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Accordion defaultExpanded={!isMobile}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="address-content"
                  id="address-header"
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Address
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{user.address.addressLine1}</Typography>
                  {user.address.addressLine2 && (
                    <Typography>{user.address.addressLine2}</Typography>
                  )}
                  <Typography>{user.address.city}</Typography>
                  <Typography>{user.address.district}</Typography>
                  <Typography>{user.address.state}</Typography>
                  <Typography>{user.address.pincode}</Typography>
                  <Typography>{user.address.country}</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogOut}
              fullWidth
              size={isMobile ? "large" : "medium"}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Profile;
