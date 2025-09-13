"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

import { ThemeContext } from "@/app/contexts/Theme";
import ToggleMode from "@/app/icons/toggle-mode.svg";

type Dashboard = {
  id: string;
  name: string;
  slug: string;
};

const TopNavClient = ({ dashboards }: { dashboards: Dashboard[] }) => {
  const pathname = usePathname();
  const items = dashboards.filter((d) => d.slug !== "/");
  const { mode, setMode } = useContext(ThemeContext);

  const toggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", mode === "dark" ? "light" : "dark");
    }
  };

  return (
    <AppBar position="relative" color="inherit" elevation={0}>
      <Container maxWidth={false}>
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Button
            component={Link}
            href="/"
            variant="text"
            color={pathname === "/" ? "primary" : "inherit"}
            sx={{ textTransform: "none" }}
          >
            Home
          </Button>
          {items.map((d) => (
            <Button
              key={d.id}
              component={Link}
              href={d.slug}
              variant="text"
              color={pathname === d.slug ? "primary" : "inherit"}
              sx={{ textTransform: "none" }}
            >
              {d.name}
            </Button>
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Toggle light/dark mode">
            <IconButton onClick={toggleTheme} color="inherit">
              <Box component={ToggleMode} sx={{ color: "text.secondary" }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNavClient;
