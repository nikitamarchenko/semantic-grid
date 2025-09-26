"use client";

import { Container, Grid, Typography } from "@mui/material";

import type { DashboardItem } from "@/app/lib/dashboards";

import DashboardCard from "./DashboardItem";

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
}: {
  title?: string;
  description?: string;
  items: (DashboardItem & DashboardItemMeta)[];
  slugPath: string;
  maxItemsPerRow?: number;
}) => (
  <Container maxWidth={false}>
    {description && (
      <Typography variant="h6" color="text.primary">
        {description}
      </Typography>
    )}
    <Grid container spacing={3} direction="row" alignItems="stretch">
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
    </Grid>
  </Container>
);

export default DashboardGrid;
