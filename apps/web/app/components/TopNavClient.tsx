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
import React, { useContext, useEffect } from "react";

import { SemanticGridMenu } from "@/app/components/SemanticGridMenu";
import { UserProfileMenu } from "@/app/components/UserProfileMenu";
import { AppContext } from "@/app/contexts/App";

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
  // const items = dashboards.filter((d) => d.slug !== "/");
  const { editMode, setEditMode } = useContext(AppContext);

  const handleToggle = () => {
    if (!editMode) {
      router.push(`/grid`);
      setEditMode(pathname);
    }
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
          {/* <Button
            component={Link}
            href="/"
            variant="text"
            color={pathname === "/" ? "primary" : "inherit"}
            sx={{ textTransform: "none" }}
          >
            {d}
          </Button> */}

          {dashboards.map((d) => (
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

          {/* <LabeledSwitch checked={Boolean(editMode)} onClick={handleToggle} /> */}

          <SemanticGridMenu mode="explore" onActionClick={handleToggle} />

          <UserProfileMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopNavClient;
