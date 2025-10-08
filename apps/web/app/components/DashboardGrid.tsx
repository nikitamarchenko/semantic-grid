"use client";

import { Container, Typography } from "@mui/material";
import { Responsive, WidthProvider } from "react-grid-layout";

import DashboardCard from "@/app/components/DashboardItem";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import type { DashboardItem } from "@/app/lib/dashboards";

const ResponsiveGridLayout = WidthProvider(Responsive);

type DashboardItemMeta = {
  title: string;
  subtype?: string;
  key?: string;
  href?: string;
  queryUid?: string;
};

const byPositionAsc = (
  a: DashboardItem & DashboardItemMeta,
  b: DashboardItem & DashboardItemMeta,
) => (a.position || 0) - (b.position || 0);

const DashboardGrid = ({
  title,
  description,
  items,
  slugPath,
  maxItemsPerRow = 2,
  layout = [],
}: {
  title?: string;
  description?: string;
  items: (DashboardItem & DashboardItemMeta)[];
  slugPath: string;
  maxItemsPerRow?: number;
  layout?: any[];
}) => {
  const [savedLayout, setSavedLayout] = useLocalStorage(
    `apegpt-layout-${slugPath || "home"}`,
    JSON.stringify(layout),
  );
  // console.log("savedLayout", savedLayout);

  const onLayoutChange = (newLayout: any) => {
    setSavedLayout(JSON.stringify(newLayout));
  };

  return (
    <Container maxWidth={false}>
      {description && (
        <Typography variant="h6" color="text.primary">
          {description}
        </Typography>
      )}
      {/* <Grid container spacing={3} direction="row" alignItems="stretch">
      {items.sort(byPositionAsc).map((it) => (
        <Grid item key={it.id} xs={12} md={12 / maxItemsPerRow}>
          <DashboardCard
            id={it.id}
            title={it.title}
            href={it.href}
            type={it.type}
            subtype={it.subtype}
            queryUid={it.queryUid}
            slugPath={slugPath}
            maxItemsPerRow={maxItemsPerRow}
          />
        </Grid>
      ))}
    </Grid> */}
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 6, sm: 3, xs: 3, xxs: 3 }}
        isDraggable
        isResizable
        layouts={{
          lg: JSON.parse(savedLayout),
          md: [],
          sm: [],
          xs: [],
          xxs: [],
        }}
        onLayoutChange={onLayoutChange}
      >
        {items.map((it, idx) => (
          <div key={it.id}>
            <DashboardCard
              id={it.id}
              title={it.title}
              // href={it.href}
              type={it.type}
              subtype={it.subtype}
              queryUid={it.queryUid}
              slugPath={slugPath}
              maxItemsPerRow={maxItemsPerRow}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </Container>
  );
};

export default DashboardGrid;
