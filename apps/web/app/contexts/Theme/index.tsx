"use client";

import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import { responsiveFontSizes } from "@mui/material/styles";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { defaultDarkTheme, defaultLightTheme, overrides } from "@/app/theme";

type TThemeContext = {
  mode: string;
  setMode: (m: "dark" | "light") => void;
  isLarge: boolean;
  isExtraLarge: boolean;
  safeRows: number;
  iOS?: boolean;
};

const initialValue: TThemeContext = {
  mode: "dark",
  setMode: (_: string) => {},
  isLarge: true,
  isExtraLarge: false,
  safeRows: 0,
  iOS: false,
};

export const ThemeContext = createContext<TThemeContext>(initialValue);

export const FlexibleThemeProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [mode, setMode] = useLocalStorage<"dark" | "light">("theme", "dark");

  const [isLarge, setLarge] = useState(false);
  const [isExtraLarge, setExtraLarge] = useState(false);
  const [safeRows, setSafeRows] = useState(0);
  const [mounted, setMounted] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, []);

  const onScreenChange = (mql: MediaQueryList, mxql: MediaQueryList) => () => {
    setLarge(mql.matches);
    setExtraLarge(mxql.matches);
  };

  const large = "(min-width: 768px) and (orientation: landscape)";
  const extraLarge = "(min-width: 1280px) and (orientation: landscape)";

  const onDarkPrefChange = (query: MediaQueryList) => () => {
    setMode(query.matches ? "dark" : "light");
  };

  useEffect(() => {
    if (!mode) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.onchange = onDarkPrefChange(mq);
      onDarkPrefChange(mq)();
    }
    const mql = window.matchMedia(large);
    const mxql = window.matchMedia(extraLarge);
    onScreenChange(mql, mxql)();
    mql.onchange = onScreenChange(mql, mxql);

    if (safeRows === 0) {
      const rows = Math.ceil((window.innerHeight * 0.6 - 112) / 52);
      setSafeRows(rows);
    }
  }, [mode]);

  useEffect(() => {
    if (!mode && prefersDarkMode) {
      setMode("dark");
      document.querySelector("html")?.setAttribute("data-theme", "dark");
      document
        .querySelector("body")
        ?.setAttribute("style", "background-color: #121212; color: white");
    } else if (mode) {
      setMode(mode);
      document.querySelector("html")?.setAttribute("data-theme", mode);
      document
        .querySelector("body")
        ?.setAttribute(
          "style",
          mode === "dark" ? "background-color: #121212" : "",
        );
    }
  }, [mode, prefersDarkMode]);

  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme(
          mode === "dark"
            ? {
                ...defaultDarkTheme,
                palette: {
                  ...defaultDarkTheme.palette,
                  background: {
                    default: "#121212",
                  },
                },
              }
            : {
                ...defaultLightTheme,
                palette: {
                  ...defaultLightTheme.palette,
                  background: {
                    default: "#ededed",
                  },
                },
              },
          overrides(mode),
        ),
      ),
    [mode],
  );

  return (
    <ThemeContext.Provider
      value={{ mode, setMode, isLarge, isExtraLarge, safeRows, iOS }}
    >
      <ThemeProvider theme={theme}>{mounted && children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
