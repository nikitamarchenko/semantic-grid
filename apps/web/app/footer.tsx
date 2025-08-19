import { Paper, Typography } from "@mui/material";

const Footer = () => (
  <Paper
    elevation={0}
    sx={{ display: "flex", justifyContent: "right", my: 1, mr: 2 }}
  >
    <Typography variant="body2" color="grey">
      &copy; Copyright {new Date().getFullYear()} by ApeGPT. All Rights Reserved
    </Typography>
  </Paper>
);

export default Footer;
