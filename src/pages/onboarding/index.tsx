import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Logout from "@/components/Logout";
import { AppConfig } from "@/utils/const";
import Help from "@/components/Help";
import { updateUserInfo } from "@/store/authSlice";
import { Party } from "../../../types/common";

interface OnboardingFormData {
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  primaryPhoneNumber: string;
}

const OnboardingPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { loggedInUser, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch();

  const router = useRouter();
  const { control, handleSubmit } = useForm<OnboardingFormData>({
    defaultValues: {
      primaryPhoneNumber: loggedInUser?.primaryPhoneNumber || "",
      country: "India",
    },
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const onSubmit = (data: OnboardingFormData) => {
    const user: Party = {
      companyName: data.companyName,
      address: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        country: data.country,
        district: data.district,
        pincode: data.pincode,
        state: data.state,
      },
      primaryPhoneNumber: data.primaryPhoneNumber,
      type: "Distributor",
    };
    dispatch(updateUserInfo({ user }));
    router.push("/dashboard");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 3 }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={1}
        >
          <Typography variant="h5" component="h1">
            Welcome to {AppConfig.appName} App
          </Typography>
          <Logout />
        </Box>

        <Paper sx={{ mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="Distributor" />
            <Tab label="Dealer" />
          </Tabs>
        </Paper>
        {activeTab === 0 ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="companyName"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Company Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="primaryPhoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              )}
            />
            <Controller
              name="addressLine1"
              control={control}
              rules={{ required: "Address Line 1 is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Address Line 1"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="addressLine2"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address Line 2 (Optional)"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="district"
              control={control}
              rules={{ required: "District is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="District"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="state"
              control={control}
              rules={{ required: "State is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="State"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="pincode"
              control={control}
              rules={{ required: "Pincode is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Pincode"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Continue as Distributor
            </Button>
          </form>
        ) : (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-around",
              flex: 1,
              height: "50vh",
            }}
          >
            <Typography variant="body1" align="center">
              If you are a dealer, please contact your distributor for access.
            </Typography>
            <Help />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OnboardingPage;
