"use client";

import { Container, Paper, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
`;

const HomePage = () => (
  <Container
    maxWidth={false}
    sx={{
      width: "100%",
      height: "calc(100vh)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Paper elevation={0}>
      <Typography
        variant="overline"
        sx={{
          animation: `${pulse} 1.5s ease-in-out infinite`,
        }}
      >
        Loading...
      </Typography>
    </Paper>
  </Container>
);

export default HomePage;
