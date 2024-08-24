import { AppConfig } from "@/utils/const";
import { Button, ButtonProps } from "@mui/material";

type HelpProps = ButtonProps & {
  message?: string;
};

const Help = ({ message = "Contact Support", ...props }: HelpProps) => {
  const handleHelp = () =>
    window.open(`https://wa.me/91${AppConfig.supportPhoneNumber}`, "_blank");

  return (
    <Button onClick={handleHelp} {...props}>
      {message}
    </Button>
  );
};

export default Help;
