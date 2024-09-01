export const getHumanErrorMessage = (errorCode: string) => {
  let humanErrorMessage = "";
  switch (errorCode) {
    case "auth/too-many-requests":
      humanErrorMessage =
        "We have received too many request from this number. Please try after some time.";
      break;
    case "auth/code-expired":
      humanErrorMessage = "OTP expired. Please try again.";
      break;
    case "auth/invalid-verification-code":
      humanErrorMessage = "Incorrect OTP. Please check and enter correct OTP.";
      break;
    default:
      humanErrorMessage =
        "Something went wrong with your request. Please try refreshing your page and try again. If the error persists, please try after some time.";
  }
  return humanErrorMessage;
};
