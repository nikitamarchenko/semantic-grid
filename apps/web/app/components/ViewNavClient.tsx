"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

import { useItemViewContext } from "@/app/contexts/ItemView";
import { ThemeContext } from "@/app/contexts/Theme";
import ToggleMode from "@/app/icons/toggle-mode.svg";

type Dashboard = {
  id: string;
  name: string;
  slug: string;
};

type ViewKey = "chart" | "grid" | "sql";
const VIEW_KEYS: ViewKey[] = ["chart", "grid", "sql"];

const ItemViewSwitcher = () => {
  const pathname = usePathname();
  const isItemPage = pathname?.startsWith("/item/");
  const ctx = useItemViewContext();

  if (!ctx) return null; // not on /item/[id]

  const { view, setView } = ctx;

  if (!isItemPage) return null;

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={view}
      onChange={(_, next: ViewKey) => next && setView(next)}
      aria-label="Item view"
      sx={{
        // Make it look like it belongs in the toolbar
        borderRadius: 999,
        "& .MuiToggleButton-root": {
          textTransform: "none",
          px: 1.5,
        },
      }}
    >
      <ToggleButton value="chart" aria-label="Chart view">
        Chart
      </ToggleButton>
      <ToggleButton value="grid" aria-label="Table view">
        Table
      </ToggleButton>
      <ToggleButton value="sql" aria-label="SQL view">
        SQL
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

const ViewNavClient = ({
  dashboards,
  item,
}: {
  dashboards: Dashboard[];
  item: any;
}) => {
  const pathname = usePathname();
  const items = dashboards.filter((d) => d.slug !== "/");
  const { mode, setMode } = useContext(ThemeContext);

  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", next);
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

          {/* Spacer between primary nav and right-side controls */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Second-level switcher: only shows on /item/[id] */}
          <ItemViewSwitcher />

          <Button
            component={Link}
            href={`/grid?q=${item?.query?.queryId}`}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", ml: 2 }}
          >
            EDIT
          </Button>

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

export default ViewNavClient;
