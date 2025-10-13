import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";

import { useItemViewContext } from "@/app/contexts/ItemView";

type ViewKey = "chart" | "grid" | "sql";
const VIEW_KEYS: ViewKey[] = ["chart", "grid", "sql"];

export const ItemViewSwitcher = () => {
  const pathname = usePathname();
  const isItemPage =
    pathname?.startsWith("/item/") || pathname?.startsWith("/grid/");
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
