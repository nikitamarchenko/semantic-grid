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
    <Grid container spacing={3}>
      {items.map((it) => (
        <Grid item key={it.id} xs={12} md={12 / maxItemsPerRow}>
          <DashboardCard
            id={it.id}
            title={it.title}
            href={it.href}
            type={it.type}
            subtype={it.subtype}
            queryUid={it.queryUid}
            slugPath={slugPath}
          />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default DashboardGrid;
