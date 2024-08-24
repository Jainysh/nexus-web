import { MenuItem, Select } from "@mui/material";

const CountryCodeDropdown = () => (
  <Select value="+91" sx={{ width: "80px", mr: 1 }} disabled>
    <MenuItem value="+91">+91</MenuItem>
  </Select>
);

export default CountryCodeDropdown;
