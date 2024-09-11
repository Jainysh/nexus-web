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
import { updateUserInfo } from "@/store/authSlice";
import { AppConfig, whiteListedNumbers } from "@/utils/const";
import {
  signInWithSupabase,
  sendOTP,
  verifyOTP,
} from "@/services/firebase/authService";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { getHumanErrorMessage } from "@/utils/helper";
import { auth } from "@/services/firebaseConfig";
import { Party } from "@/types/common";

type FormData = {
  primaryPhoneNumber: string;
  otp: string;
};

type NotificationType = {
  severity: "error" | "info" | "success" | "warning";
  message: string;
};

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult>();
  const [otpSent, setOtpSent] = useState(false);
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [isProcessingReq, setIsProcessingReq] = useState(false);
  const [isProcessingOTP, setIsProcessingOTP] = useState(false);
  const [appVerifier, setAppVerifier] = useState<RecaptchaVerifier>();
  const [alert, setAlert] = useState<NotificationType | undefined>();
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      otp: "",
      primaryPhoneNumber: "",
    },
  });

  const phoneNumber = watch("primaryPhoneNumber");
  const otp = watch("otp");

  useEffect(() => {
    if (isLoggedIn && !user?.companyName) {
      router.push("/onboarding");
    } else if (isLoggedIn && user?.companyName) {
      router.push("/dashboard");
    }
  }, [router, isLoggedIn, user]);

  const onSubmit = async (data: FormData) => {
    setIsProcessingReq(true);
    setAlert(undefined);
    try {
      const firebaseUser = await verifyOTP(confirmationResult, data.otp);
      try {
        const user = await signInWithSupabase(firebaseUser);
        dispatch(updateUserInfo({ user: user?.user_metadata as Party }));
        // TODO fetch user profile based on logged in user, currently it's hardcoded in loggedInUser
        if (user?.user_metadata) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Something missed", error);
        setAlert({
          message: "Server Error. Please try again.",
          severity: "error",
        });
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      const message = getHumanErrorMessage(error.code);
      setAlert({
        severity: "error",
        message,
      });
      setValue("otp", "");
    }
    setIsProcessingReq(false);
  };

  const handleSendOTP = async () => {
    setIsProcessingOTP(true);
    setAlert(undefined);
    setOtpSent(false);
    if (whiteListedNumbers.includes(`+91${phoneNumber}`)) {
      try {
        let result;
        if (!appVerifier) {
          const appVerifierRes = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "invisible",
            }
          );
          setAppVerifier(appVerifierRes);
          result = await sendOTP(`+91${phoneNumber}`, appVerifierRes);
        } else {
          result = await sendOTP(`+91${phoneNumber}`, appVerifier);
        }
        setAlert({ message: "OTP sent successfully.", severity: "success" });
        setConfirmationResult(result);
        setOtpSent(true);
        setOtpResendTime(30);
      } catch (error) {
        console.error("Error sending OTP:", error);
        setAlert({
          severity: "error",
          message: "Server error, couldn't send OTP. Please try again.",
        });
      }
    } else {
      setAlert({
        severity: "error",
        message: "You are not authorized to use this application",
      });
    }
    setIsProcessingOTP(false);
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
    setOtpResendTime(30);
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
              <OTPInput control={control} otp={otp} />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={!otp || otp.length !== 6 || isProcessingReq}
              >
                {isProcessingReq ? "Taking you in..." : "Login"}
              </Button>
              {alert && (
                <Alert severity={alert.severity} sx={{ width: "100%", mt: 2 }}>
                  {alert.message}
                </Alert>
              )}
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
            </>
          ) : (
            <>
              {alert && (
                <Alert severity={alert.severity} sx={{ width: "100%", my: 2 }}>
                  {alert.message}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                disabled={
                  !phoneNumber || phoneNumber.length !== 10 || isProcessingOTP
                }
                onClick={handleSendOTP}
              >
                {isProcessingOTP ? "Sending" : "Send"} OTP
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
