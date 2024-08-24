import React, { useRef, useEffect } from "react";
import { Controller, Control } from "react-hook-form";
import { TextField, Box } from "@mui/material";

interface OTPInputProps {
  control: Control<any>;
}

const OTPInput: React.FC<OTPInputProps> = ({ control }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (inputRefs.current[index]?.value) {
        inputRefs.current[index]!.value = "";
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    pastedData.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
        handleChange(index, char);
      }
    });
  };

  return (
    <Controller
      name="otp"
      control={control}
      rules={{ required: "OTP is required", pattern: /^\d{6}$/ }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                variant="outlined"
                type="number"
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center" },
                  inputMode: "decimal",
                }}
                sx={{ width: "3rem", mr: index < 5 ? 1 : 0 }}
                onChange={(e) => {
                  handleChange(index, e.target.value);
                  const newOtp = inputRefs.current
                    .map((input) => input?.value || "")
                    .join("");
                  onChange(newOtp);
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
              />
            ))}
          </Box>
          {error && (
            <Box color="error.main" fontSize="0.75rem" mt={1}>
              {error.type === "required" ? "OTP is required" : "Invalid OTP"}
            </Box>
          )}
        </Box>
      )}
    />
  );
};

export default OTPInput;
