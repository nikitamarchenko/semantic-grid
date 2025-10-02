"use client";

import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

import { ItemViewSwitcher } from "@/app/components/ItemViewSwitcher";
import { SemanticGridMenu } from "@/app/components/SemanticGridMenu";
import { UserProfileMenu } from "@/app/components/UserProfileMenu";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";

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

          {/* <LabeledSwitch checked /> */}

          <SemanticGridMenu mode="editing" onActionClick={handleToggle} />

          <UserProfileMenu />
        </Toolbar>
      </Container>
      <Alert
        sx={{ height: 40, alignItems: "center" }}
        // variant="filled"
        severity="warning"
        action={
          <Stack direction="row">
            <Button color="inherit" size="small">
              Cancel
            </Button>
            <Button color="inherit" size="small">
              Save
            </Button>
          </Stack>
        }
      >
        You are now in Semantic Grid AI edit mode. When finished, save your work
        in your User Dashboard.
      </Alert>
    </AppBar>
  );
};

export default GridItemNavClient;
