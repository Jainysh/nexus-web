import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import OTPInput from "@/components/login/OTPInput";
import CountryCodeDropdown from "@/components/login/CountryCodeDropdown";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { login } from "@/store/authSlice";
import { AppConfig } from "@/utils/const";
import {
  createOrUpdateSupabaseUser,
  sendOTP,
  verifyOTP,
} from "@/services/firebase/authService";
import { ConfirmationResult } from "firebase/auth";
import { getHumanErrorMessage } from "@/utils/helper";

type FormData = {
  primaryPhoneNumber: string;
  otp: string;
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoggedIn, loggedInUser } = useSelector(
    (state: RootState) => state.auth
  );

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult>();
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [isProcessingReq, setIsProcessingReq] = useState(false);

  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      otp: "",
      primaryPhoneNumber: "",
    },
  });

  const phoneNumber = watch("primaryPhoneNumber");
  const otp = watch("otp");

  useEffect(() => {
    if (isLoggedIn && !loggedInUser?.companyName) {
      router.push("/onboarding");
    } else if (isLoggedIn && loggedInUser?.companyName) {
      router.push("/dashboard");
    }
  }, [router, isLoggedIn, loggedInUser]);

  const whitelistNumbers = ["8123646364", "9049778749"];

  const onSubmit = async (data: FormData) => {
    setIsProcessingReq(true);
    console.log(data);
    try {
      const firebaseUser = await verifyOTP(confirmationResult, data.otp);
      try {
        const response = await createOrUpdateSupabaseUser(firebaseUser);
        console.log("creating user response", response);
        dispatch(
          login({ primaryPhoneNumber: `+91${data.primaryPhoneNumber}` })
        );
        // TODO fetch user profile based on logged in user, currently it's hardcoded in loggedInUser
        if (loggedInUser) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Something missed", error);
        setError("Something went wrong, please try again");
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      const errorMessageToShow = getHumanErrorMessage(error.code);
      setError(errorMessageToShow);
    }
    setIsProcessingReq(false);
  };

  const handleSendOTP = async () => {
    setIsProcessingReq(true);
    try {
      const result = await sendOTP(`+91${phoneNumber}`);
      setConfirmationResult(result);
      setOtpSent(true);
      setOtpResendTime(30);
      setIsProcessingReq(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsProcessingReq(false);
    }
  };

  const handleResendOTP = () => {
    setOtpResendTime(30);
    // TODO Handle OTP resending logic here
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpResendTime > 0) {
      timer = setTimeout(() => setOtpResendTime(otpResendTime - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpResendTime]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div id="recaptcha-container"></div>
        <Typography component="h1" variant="h5">
          Login to {AppConfig.appName}
        </Typography>
        <Typography sx={{ mt: 1, mb: 8 }} color="gray">
          Easy way to manage your stock requirements
        </Typography>
        <Box
          onSubmit={handleSubmit(onSubmit)}
          component="form"
          sx={{ mt: 1, width: "100%" }}
        >
          <Box display="flex" alignItems="flex-end" mb={2}>
            <CountryCodeDropdown />
            <Controller
              name="primaryPhoneNumber"
              control={control}
              rules={{
                required: "Phone number is required",
                pattern: /^\d{10}$/,
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  variant="outlined"
                  type="number"
                  inputProps={{
                    inputMode: "decimal",
                  }}
                  fullWidth
                  error={!!error}
                  helperText={
                    error ? "Enter a valid 10-digit phone number" : ""
                  }
                />
              )}
            />
          </Box>

          {otpSent ? (
            <>
              <OTPInput control={control} />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={!otp || otp.length !== 6 || isProcessingReq}
              >
                {isProcessingReq ? "Taking you in..." : "Login"}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={handleResendOTP}
                disabled={otpResendTime > 0}
                sx={{ mt: 2 }}
              >
                {otpResendTime > 0
                  ? `Resend OTP in ${otpResendTime}s`
                  : "Resend OTP"}
              </Button>
              {error && (
                <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                  {error}
                </Alert>
              )}
            </>
          ) : (
            <Button
              fullWidth
              variant="contained"
              disabled={
                !phoneNumber || phoneNumber.length !== 10 || isProcessingReq
              }
              onClick={handleSendOTP}
            >
              {isProcessingReq ? "Sending" : "Send"} OTP
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
