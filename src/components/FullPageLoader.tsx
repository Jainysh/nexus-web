import { Box, Typography } from "@mui/material";
import BrandIcon from "./icons/BrandIcon";

interface FullPageLoaderProps {
  message?: string;
}

const FullPageLoader = ({ message = "Loading..." }: FullPageLoaderProps) => {
  return (
    <Box
      sx={{
        position: "fixed",
        height: "100%",
        width: "100%",
        bgcolor: "#0000008a",
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        {/* <CircularProgress /> */}
        <BrandIcon />
        <Typography color={"white"} sx={{ paddingTop: "16px" }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default FullPageLoader;
