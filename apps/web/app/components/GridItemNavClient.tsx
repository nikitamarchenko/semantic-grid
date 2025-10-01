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
import React, { useContext, useEffect } from "react";

import { ItemViewSwitcher } from "@/app/components/ItemViewSwitcher";
import { LabeledSwitch } from "@/app/components/LabeledSwitch";
import { UserProfileMenu } from "@/app/components/UserProfileMenu";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import ChatSelectorIcon from "@/app/icons/chat-selector.svg";

type Dashboard = {
  id: string;
  name: string;
  slug: string;
};

const GridItemNavClient = ({
  dashboards,
  uid,
  dashboardId,
}: {
  dashboards: Dashboard[];
  uid?: string;
  dashboardId?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const items = dashboards.filter((d) => d.slug !== "/");
  console.log("nav items", items, pathname);
  const { mode, setMode } = useContext(ThemeContext);
  const { setNavOpen, editMode, setEditMode } = useContext(AppContext);

  const handleToggle = () => {
    if (editMode) {
      router.replace(editMode);
      setEditMode("");
    }
  };

  useEffect(() => {
    if (!editMode) {
      setEditMode("/");
    }
  }, []);

  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", next);
    }
  };

  const handleDrawerOpen = () => {
    setNavOpen((o) => !o);
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

          <ItemViewSwitcher />

          <LabeledSwitch checked={Boolean(editMode)} onClick={handleToggle} />

          {/* <Button
            component={Link}
            href="#"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", ml: 2 }}
            onClick={onSaveClick}
          >
            SAVE
          </Button> */}
          <Tooltip title="Open chat selector">
            <span>
              <IconButton
                // disableRipple
                // disableTouchRipple
                // disableFocusRipple
                // disabled={!user}
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                // edge="start"
              >
                <Box
                  component={ChatSelectorIcon}
                  sx={{ color: "text.secondary" }}
                />
              </IconButton>
            </span>
          </Tooltip>

          <UserProfileMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default GridItemNavClient;
