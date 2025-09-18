"use client";

import { alpha, Box, CircularProgress } from "@mui/material";
import { ChartsTooltip, LineChart, PieChart } from "@mui/x-charts";
import { type GridColDef } from "@mui/x-data-grid";
import React, { useMemo } from "react";

import {
  buildGridColumns,
  buildPieChartSeries,
  normalizeDataSet,
} from "@/app/helpers/chart";
import { useQuery } from "@/app/hooks/useQuery";
import { useQueryObject } from "@/app/hooks/useQueryObject";

export const DashboardChartItem = ({
  queryId,
  chartType,
}: {
  queryId: string;
  chartType: string;
}) => {
  const { data: query, isLoading: queryObjectIsLoading } =
    useQueryObject(queryId);

  const {
    data,
    error: dataError,
    isLoading,
  } = useQuery({
    id: query?.query_id,
    sql: query?.sql,
    limit: 20,
    offset: 0,
  });

  const gridColumns: GridColDef[] = useMemo(() => {
    if (!query) return [];

    const userColumns = buildGridColumns(query);

    return [...userColumns];
  }, [query]);

  const pieSeries = useMemo(
    () => buildPieChartSeries(data?.rows || [], gridColumns),
    [data, gridColumns],
  );

  const lineChartSeries = useMemo(
    () =>
      gridColumns.slice(1).map((col) => ({
        id: col.field?.replace("col_", ""),
        label: col.headerName,
        dataKey: col.field?.replace("col_", ""), // EXACTLY matches dataset key
        showMark: false,
      })),
    [gridColumns],
  );

  const xAxis = useMemo(
    () => [
      {
        dataKey: gridColumns[0]?.field?.replace("col_", ""),
        scaleType: "time",
        valueFormatter: (value: Date) => value.toLocaleDateString(),
        // valueFormatter: (value: number) => new Date(value).toString(),
      },
    ],
    [gridColumns],
  );

  if (chartType === "pie") {
    return (
      <>
        <PieChart series={pieSeries} width={200} height={200} />
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={(theme) => alpha(theme.palette.background.default, 0.6)}
          >
            <CircularProgress />
          </Box>
        )}
      </>
    );
  }
  if (chartType === "line") {
    return (
      <>
        <LineChart
          xAxis={xAxis as any} // e.g. 'col_0'
          series={lineChartSeries}
          dataset={normalizeDataSet(data?.rows || [], gridColumns)}
          width={400}
          height={300}
        >
          <ChartsTooltip /> {/* enables tooltips for all series at hovered X */}
        </LineChart>
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={(theme) => alpha(theme.palette.background.default, 0.6)}
          >
            <CircularProgress />
          </Box>
        )}
      </>
    );
  }
  return <div>Unsupported chart type: {chartType}</div>;
};
