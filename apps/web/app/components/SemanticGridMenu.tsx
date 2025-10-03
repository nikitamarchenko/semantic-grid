import { AutoAwesome } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { AppContext } from "@/app/contexts/App";
import { byTime, toUserHistoryEntry } from "@/app/helpers/nav";
import { useAppUser } from "@/app/hooks/useAppUser";
import { useUserSessions } from "@/app/hooks/useUserSessions";

export type TSemanticGridMode = "explore" | "edit" | "editing";

const tooltips = {
  explore: "Explore data with Semantic Grid AI",
  edit: "Edit query with Semantic Grid AI",
  editing: "Editing with Semantic Grid AI",
};

const colors = {
  explore: "inherit",
  edit: "inherit",
  editing: "primary",
};

export const SemanticGridMenu = ({
  mode = "explore",
  onActionClick,
}: {
  mode: TSemanticGridMode;
  onActionClick: () => void;
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, authUser } = useAppUser();
  const {
    data: sessions,
    error: dataError,
    mutate,
    isLoading: sessionsAreLoading,
  } = useUserSessions();
  const { setNavOpen, editMode, setEditMode } = useContext(AppContext);

  const handleToggle = () => {};

  useEffect(() => {
    if (!editMode) {
      setEditMode("/");
    }
  }, []);

  const history = useMemo(
    () =>
      sessions
        .sort(byTime)
        .map(toUserHistoryEntry)
        .filter((s: any) => !s.tags.includes("hidden") && s.message_count > 0),
    [sessions],
  );

  const openMenu = Boolean(anchorEl);

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const onSaveClicked = async () => {
    if (editMode) {
      router.replace(editMode);
      setEditMode("");
    }
  };

  return (
    <>
      <Tooltip title={tooltips[mode]}>
        <IconButton
          color={openMenu ? "primary" : (colors[mode] as any)}
          onClick={handleButtonClick}
          sx={{
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <AutoAwesome />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        elevation={1}
        open={openMenu}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          width: 400,
          "& ul": {
            paddingY: "0px",
          },
          "& .MuiButtonBase-root:last-of-type": {
            borderTop: `1px solid ${"palette.grey[300]"}`,
          },
        }}
      >
        {mode === "edit" && (
          <MenuItem onClick={onActionClick}>
            Edit with Semantic Grid AI
          </MenuItem>
        )}
        {mode === "explore" && (
          <MenuItem component={Link} href="/grid">
            New Semantic Grid session
          </MenuItem>
        )}
        {mode === "editing" && (
          <MenuItem onClick={onActionClick}>End session</MenuItem>
        )}
        {mode === "editing" && (
          <MenuItem onClick={onActionClick}>New session</MenuItem>
        )}
        {user && history && history.length > 0 && <Divider />}
        {user && history && history.length > 0 && (
          <MenuItem disabled>Previous sessions</MenuItem>
        )}
        {user && history && history.length > 0 && (
          <Accordion
            sx={{
              boxShadow: "none",
              "&:before": {
                display: "none",
              },
            }}
            elevation={0}
            disableGutters
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">Latest 10</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {user &&
                history &&
                history.length > 0 &&
                history.slice(0, 10).map((s: any) => (
                  <MenuItem
                    key={s.id}
                    disabled={s.current}
                    component={Link}
                    href={`/grid/${s.uid}`}
                  >
                    <Tooltip title={s.name}>
                      <Typography variant="body2" noWrap>
                        {s.name}
                      </Typography>
                    </Tooltip>
                  </MenuItem>
                ))}
            </AccordionDetails>
          </Accordion>
        )}

        {user && history && history.length > 0 && (
          <Accordion
            elevation={0}
            sx={{
              boxShadow: "none",
              "&:before": {
                display: "none",
              },
            }}
            disableGutters
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">All other</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {user &&
                history &&
                history.length > 0 &&
                history.slice(10).map((s: any) => (
                  <MenuItem
                    key={s.id}
                    disabled={s.current}
                    component={Link}
                    href={`/grid/${s.uid}`}
                  >
                    <Tooltip title={s.name}>
                      <Typography variant="body2" noWrap>
                        {s.name}
                      </Typography>
                    </Tooltip>
                  </MenuItem>
                ))}
            </AccordionDetails>
          </Accordion>
        )}
        <Divider />
        <MenuItem>About Semantic Grid AI</MenuItem>
      </Menu>
    </>
  );
};
