import { MoreVert } from "@mui/icons-material";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuChoice = async (val: string) => {
    console.log("Menu choice:", val, "for query:", query);
    const [op, itemType = "table", chartType] = val.split("-"); // e.g., view-table, view-chart-pie
    // Implement the action based on choice
    switch (val) {
      case "view-table":
        await editDefaultItemView({
          itemId: id,
          itemType: itemType as any,
          chartType,
        });
        break;
      case "view-chart-pie":
        await editDefaultItemView({
          itemId: id,
          itemType: itemType as any,
          chartType,
        });
        break;
      case "view-chart-line":
        await editDefaultItemView({
          itemId: id,
          itemType: itemType as any,
          chartType,
        });
        break;

      case "edit":
        // e.g., navigate to edit page
        break;
      case "delete":
        // e.g., call delete API
        // eslint-disable-next-line no-restricted-globals,no-alert
        if (confirm(`Are you sure you want to delete item`)) {
          // Call delete API here
        }
        break;
      default:
        break;
    }
    setAnchorEl(null);
  };

  const ItemMenu = [
    {
      label: "Show as Table",
      action: (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        handleMenuChoice("view-table");
      },
    },
    {
      label: "Show as Pie Chart",
      action: (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        handleMenuChoice("view-chart-pie");
      },
    },
    {
      label: "Show as Line Chart",
      action: (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        handleMenuChoice("view-chart-line");
      },
    },
    { label: "sep1", isSeparator: true },
    {
      label: "Edit",
      action: (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        handleMenuChoice("edit");
      },
    },
    {
      label: "Delete",
      action: (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        handleMenuChoice("delete");
      },
    },
  ];

  return (
    <Box>
      <IconButton onClick={handleClick} size="small">
        <MoreVert />
      </IconButton>
      <Menu
        disablePortal
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={handleClose}
        onClick={handleClick} // prevent bubbling to parent
      >
        {ItemMenu.map((mi) =>
          mi.isSeparator ? (
            <Divider key={mi.label} />
          ) : (
            <MenuItem
              disabled={!slugPath.startsWith("/user")}
              key={mi.label}
              onClick={mi.action}
              color={mi.label === "Delete" ? "error.main!important" : "inherit"}
              sx={{
                minWidth: 100,
                "&.MuiButtonBase-root.MuiMenuItem-root": {
                  color: mi.label === "Delete" ? "error.main" : "inherit",
                },
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
