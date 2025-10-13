"use client";

import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

import { addQueryToUserDashboard } from "@/app/actions";
import { ItemViewSwitcher } from "@/app/components/ItemViewSwitcher";
import { SemanticGridMenu } from "@/app/components/SemanticGridMenu";
import { UserProfileMenu } from "@/app/components/UserProfileMenu";
import { AppContext } from "@/app/contexts/App";
import { useItemViewContext } from "@/app/contexts/ItemView";
import { ThemeContext } from "@/app/contexts/Theme";

type Dashboard = {
  id: string;
  name: string;
  slug: string;
};

const GridItemNavClient = ({
  id,
  dashboards,
  uid,
  dashboardId,
  metadata,
  queryUid,
}: {
  id: string;
  dashboards: Dashboard[];
  uid?: string;
  dashboardId?: string;
  metadata?: any;
  queryUid?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const items = dashboards.filter((d) => d.slug !== "/");
  const { mode, setMode } = useContext(ThemeContext);
  const { setNavOpen, editMode, setEditMode } = useContext(AppContext);
  const { view } = useItemViewContext();
  // console.log("grid nav items", metadata, queryUid, uid);

  const handleToggle = () => {
    if (editMode && queryUid) {
      addQueryToUserDashboard({
        queryUid,
        itemType: view === "chart" ? "chart" : "table",
      }).then(() => {
        setEditMode("");
        router.replace(`/user/${uid}`);
      });
    } else {
      setEditMode("");
      router.replace(editMode);
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

          {metadata && <ItemViewSwitcher />}

          {/* <LabeledSwitch checked /> */}

          <SemanticGridMenu
            mode="editing"
            onActionClick={handleToggle}
            hasQuery={Boolean(metadata)}
          />

          <UserProfileMenu />
        </Toolbar>
      </Container>
      {/* <Alert
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
      </Alert> */}
    </AppBar>
  );
};

export default GridItemNavClient;
