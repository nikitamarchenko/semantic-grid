// Extend props to accept placeholder for condition
import type { OutlinedInputProps } from "@mui/material";
import { OutlinedInput, styled } from "@mui/material";
import { keyframes } from "@mui/material/styles";

const glowMove = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 120% 0;
  }
`;

interface GlowingInputProps extends OutlinedInputProps {
  placeholder?: string;
}

// Styled component
export const GlowingOutlinedInput = styled((props: GlowingInputProps) => (
  <OutlinedInput {...props} multiline />
))(({ theme, placeholder }) => {
  const shouldGlow = placeholder === "Ask me anything";
  const isDark = theme.palette.mode === "dark";

  return shouldGlow
    ? {
        "& textarea::placeholder": {
          color: "transparent",
          background: `linear-gradient(90deg, transparent 0%, ${
            isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.85)"
          } 40%, ${
            isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.85)"
          } 60%, transparent 0%)`,
          backgroundSize: "20% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0% 0%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitTextFillColor: "transparent",
          animation: `${glowMove} 2.5s linear infinite`,
        },
      }
    : {
        "& textarea::placeholder": {
          color: isDark ? "#eee" : "#888",
        },
      };
});
