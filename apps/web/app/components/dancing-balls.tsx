import { keyframes } from "@emotion/react";
import { styled, Typography } from "@mui/material";
import React, { useContext } from "react";

import { ThemeContext } from "@/app/contexts/Theme";
import styles from "@/app/page.module.css";

export const DancingBalls = ({ status = "" }) => {
  const { mode } = useContext(ThemeContext);
  return (
    <>
      <div>{status}</div>
      <div className={styles.balls}>
        <span
          className={styles.ball}
          style={{ backgroundColor: mode === "dark" ? "white" : "black" }}
        />
        <span
          className={styles.ball}
          style={{ backgroundColor: mode === "dark" ? "white" : "black" }}
        />
        <span
          className={styles.ball}
          style={{ backgroundColor: mode === "dark" ? "white" : "black" }}
        />
      </div>
    </>
  );
};

// Define the keyframes for pulsing opacity
export const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.1; }
  100% { opacity: 1; }
`;

// Styled Typography with pulsing animation
export const PulsingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  animation: `${pulse} 1.5s ease-in-out infinite`,
}));

const Status: Record<string, string> = {
  New: "Starting...",
  Intent: "Analyzing intent...",
  SQL: "Generating query...",
  Retry: "Refining response...",
  DataFetch: "Fetching data...",
  Finalizing: "Finalizing...",
};

export const StatusIndicator = ({ text = "New" }) => (
  <PulsingText variant="body1">{Status[text]}</PulsingText>
);
