import { styled, Switch } from "@mui/material";

const TRACK_H = 30;
const THUMB = TRACK_H - 4; // 2px gap each side

export const LabeledSwitch = styled(Switch)(({ theme }) => {
  const offBg = theme.palette.grey[700];
  const onBg = "#FFA500"; // theme.palette.primary.main;

  return {
    width: 86, // can be any width — text length decides
    height: TRACK_H,
    padding: 0,
    cursor: "pointer",

    "& .MuiSwitch-switchBase": {
      position: "absolute",
      inset: 0,
      padding: 0,
      margin: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start", // OFF = thumb left
      transform: "none",

      "& .MuiSwitch-input": {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        cursor: "pointer",
      },

      "&.Mui-checked": {
        justifyContent: "flex-end", // ON = thumb right
        transform: "translateX(-0px)",

        "& + .MuiSwitch-track": {
          backgroundColor: onBg,
        },
        "& + .MuiSwitch-track::before": { opacity: 1 },
        "& + .MuiSwitch-track::after": { opacity: 0 },
      },
    },

    "& .MuiSwitch-thumb": {
      width: THUMB,
      height: THUMB,
      borderRadius: "50%",
      backgroundColor: theme.palette.common.white,
      boxShadow: "none",
      transition: theme.transitions.create(["transform"], { duration: 200 }),
    },

    "& .MuiSwitch-track": {
      opacity: 1,
      borderRadius: TRACK_H / 2,
      backgroundColor: offBg,
      transition: theme.transitions.create(["background-color"], {
        duration: 200,
      }),
      position: "relative",
      pointerEvents: "none",

      "&::before, &::after": {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: 12,
        fontWeight: 700,
        pointerEvents: "none",
        transition: "opacity 200ms, color 200ms",
        mixBlendMode: "normal", // avoid blending with bg
        textShadow: "0 1px 0 rgba(0,0,0,0.35)", // subtle boost on dark
      },

      "&::before": {
        content: '"Editing"', // ON label
        left: 12,
        opacity: 0,
        color: theme.palette.getContrastText(onBg),
      },

      "&::after": {
        content: '"AI Edit"', // OFF label
        right: 12,
        opacity: 1,
        color: theme.palette.getContrastText(offBg),
      },
    },
  };
});
