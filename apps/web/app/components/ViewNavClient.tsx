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
import { usePathname, useRouter } from "next/navigation";
import React, { useContext } from "react";

import { ItemViewSwitcher } from "@/app/components/ItemViewSwitcher";
import { LabeledSwitch } from "@/app/components/LabeledSwitch";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import ToggleMode from "@/app/icons/toggle-mode.svg";

type Dashboard = {
  id: string;
  name: string;
  slug: string;
};

const ViewNavClient = ({
  dashboards,
  item,
}: {
  dashboards: Dashboard[];
  item: any;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const items = dashboards.filter((d) => d.slug !== "/");
  const { mode, setMode } = useContext(ThemeContext);
  console.log("nav items", item, items);

  const { editMode, setEditMode } = useContext(AppContext);

  const handleToggle = () => {
    if (!editMode) {
      router.push(`/grid?q=${item?.query?.queryUid}`);
      setEditMode(pathname);
    } else {
      setEditMode("");
    }
  };

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

          <LabeledSwitch checked={Boolean(editMode)} onClick={handleToggle} />

          {/* <Button
            component={Link}
            href={`/grid?q=${item?.query?.queryUid}`}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", ml: 2 }}
          >
            EDIT
          </Button> */}

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
