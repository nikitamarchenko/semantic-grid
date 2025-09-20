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
}: {
  title?: string;
  description?: string;
  items: (DashboardItem & DashboardItemMeta)[];
}) => (
  <Container maxWidth={false}>
    {description && (
      <Typography variant="h6" color="text.primary">
        {description}
      </Typography>
    )}
    <Grid container spacing={3}>
      {items.map((it) => (
        <Grid item key={it.id} xs={12} sm={6} md={4}>
          <DashboardCard
            id={it.id}
            title={it.title}
            href={it.href}
            type={it.type}
            subtype={it.subtype}
            queryUid={it.queryUid}
          />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default DashboardGrid;
