import { MoreVert } from "@mui/icons-material";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { editDefaultItemView } from "@/app/actions";
import type { TQuery } from "@/app/lib/types";

export const DashboardItemMenu = ({
  id,
  query,
  slugPath,
}: {
  id: string;
  query: TQuery;
  slugPath: string;
}) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = slugPath.startsWith("/user");

  const stop = (e: React.SyntheticEvent | MouseEvent) => {
    // block both bubbling and default (important for <a> / Link)
    e.stopPropagation?.();
    (e as MouseEvent).preventDefault?.();
    // in stubborn cases (Next.js Link on parent), also:
    // @ts-ignore
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    stop(event);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleCloseWithStop = (
    event: {},
    _reason: "backdropClick" | "escapeKeyDown",
  ) => {
    // MUI passes the original event here -> stop it so the parent link doesn't fire
    // @ts-ignore
    if (event?.stopPropagation) stop(event as unknown as MouseEvent);
    handleClose();
  };

  const handleMenuChoice = async (val: string, e?: React.MouseEvent) => {
    if (e) stop(e);
    const [, itemType = "table", chartType] = val.split("-");
    switch (val) {
      case "item":
        router.push(`/item/${id}#${itemType}`);
        break;
      case "view-table":
      case "view-chart-pie":
      case "view-chart-line":
        await editDefaultItemView({
          itemId: id,
          itemType: itemType as any,
          chartType,
        });
        break;
      case "edit":
      case "copy":
        router.push(`/grid?q=${query.query_id}`);
        break;
      case "delete":
        // eslint-disable-next-line no-restricted-globals,no-alert
        if (confirm(`Are you sure you want to delete item`)) {
          // delete API
        }
        break;
      default:
        break;
    }
    handleClose();
  };

  const ItemMenu = (user: boolean) =>
    user
      ? [
          { label: "Show as Table", key: "view-table" },
          { label: "Show as Pie Chart", key: "view-chart-pie" },
          { label: "Show as Line Chart", key: "view-chart-line" },
          { label: "sep1", isSeparator: true },
          { label: "View", key: "item" },
          { label: "Edit", key: "edit" },
          { label: "Delete", key: "delete", destructive: true, disabled: true },
        ]
      : [
          { label: "View", key: "item" },
          { label: "Copy and edit", key: "copy" },
        ];

  return (
    <Box
      // belt-and-suspenders: block clicks on the wrapper too
      onClick={stop}
      onMouseDown={stop}
    >
      <IconButton
        id="dashboard-item-menu-button"
        onClick={handleButtonClick}
        onMouseDown={stop}
        size="small"
      >
        <MoreVert />
      </IconButton>

      <Menu
        disablePortal
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseWithStop}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        // Stop events inside the menu before they escape
        MenuListProps={{
          "aria-labelledby": "dashboard-item-menu-button",
          onClick: (e: React.MouseEvent) => stop(e),
          onMouseDown: (e: React.MouseEvent) => stop(e),
        }}
        // Also attach to the paper element for safety (menus render in a portal)
        slotProps={{
          paper: {
            onClick: (e: React.MouseEvent) => stop(e),
            onMouseDown: (e: React.MouseEvent) => stop(e),
          },
        }}
      >
        {ItemMenu(user).map((mi) =>
          mi.isSeparator ? (
            <Divider key={mi.label} />
          ) : (
            <MenuItem
              key={mi.label}
              disabled={mi.disabled}
              onMouseDown={(e) => stop(e)}
              onClick={(e) => handleMenuChoice(mi.key!, e)}
              sx={{
                minWidth: 140,
                ...(mi.destructive && {
                  color: "error.main",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: (t) => t.palette.error.light,
                    color: "error.main",
                  },
                  "&.Mui-focusVisible": { color: "error.main" },
                }),
              }}
            >
              {mi.label}
            </MenuItem>
          ),
        )}
      </Menu>
    </Box>
  );
};
