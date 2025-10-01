"use client";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import React, { useContext, useEffect, useState } from "react";

import { LabeledSwitch } from "@/app/components/LabeledSwitch";
import { UserProfileMenu } from "@/app/components/UserProfileMenu";
import { AppContext } from "@/app/contexts/App";
import { ThemeContext } from "@/app/contexts/Theme";
import { useAppUser } from "@/app/hooks/useAppUser";

type Dashboard = {
  id: string;
  name: string;
  slug: string;
};

interface ToggleSliderHandleProps extends CSSProperties {
  size: number | string;
}

const ToggleSliderHandle = (props: ToggleSliderHandleProps) => (
  <div style={{ width: props.size, height: props.size, ...props }}>
    <Typography>Handle</Typography>
  </div>
);

const ToggleSliderBar = (props: CSSProperties) => (
  <div style={props}>
    <Typography>Bar</Typography>
  </div>
);

const TopNavClient = ({ dashboards }: { dashboards: Dashboard[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const items = dashboards.filter((d) => d.slug !== "/");
  const { mode, setMode } = useContext(ThemeContext);
  const { editMode, setEditMode } = useContext(AppContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const { user, authUser } = useAppUser();

  const handleToggle = () => {
    if (!editMode) {
      router.push(`/grid`);
      setEditMode(pathname);
    }
  };

  const toggleTheme = () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", next);
    }
  };

  const toggleUserProfile = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (editMode) {
      setEditMode("");
    }
  }, [pathname, editMode]);

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

          {/* <Button
            component={Link}
            href="/grid"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", ml: 2 }}
          >
            NEW
          </Button> */}

          <LabeledSwitch checked={Boolean(editMode)} onClick={handleToggle} />

          <UserProfileMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNavClient;
