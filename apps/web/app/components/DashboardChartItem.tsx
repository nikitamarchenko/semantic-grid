"use client";

import { LineChart, PieChart } from "@mui/x-charts";
import { type GridColDef } from "@mui/x-data-grid";
import React, { useMemo } from "react";

import { StyledValue } from "@/app/components/StyledValue";
import { useQuery } from "@/app/hooks/useQuery";
import { useQueryObject } from "@/app/hooks/useQueryObject";
import type { TColumn, TQuery } from "@/app/lib/types";

const signatureSubstrings = ["signature", "hash", "tx", "transaction"];
const walletSubstrings = ["wallet", "address", "account", "mint"];
const tickerSubstrings = ["symbol", "ticker"];

const columnWidth = (name: string) => {
  const isWallet = walletSubstrings.some((sub) => name.includes(sub));
  const isTicker = tickerSubstrings.some((sub) => name.includes(sub));
  const isSignature = signatureSubstrings.some((sub) => name.includes(sub));
  if (isSignature) {
    return 220; // Superwide for tx-related columns
  }
  if (isWallet) {
    return 480; // Wider for wallet-related columns
  }
  if (isTicker) {
    return 180; // Wider for ticker-related columns
  }
  return 200; // Default width for other columns
};

const buildGridColumns = (query: TQuery) => {
  if (!query || !query.columns) return [];

  return (
    query.columns?.map((col: TColumn, idx: number) => ({
      field: col.id || `col_${idx}`,
      headerName: col.column_alias
        ?.replace(/_/g, " ")
        .replace(/^\w/, (c: any) => c.toUpperCase()),
      headerDescription: col.column_description,
      width: col.column_alias ? columnWidth(col.column_alias) : 200,
      sortable: false,
      renderCell: (params: any) => (
        <StyledValue
          columnType={col.column_type?.replace("Nullable(", "")}
          value={params.value}
          params={params}
          successors={[]}
        />
      ),
    })) || []
  );
};

const buildPieChartSeries = (rows: any[], gridColumns: GridColDef[]) => {
  if (gridColumns.length < 2) return [];

  const categoryCol = gridColumns[0];
  const valueCol = gridColumns.slice(-1)[0];

  const seriesData = rows.map((row) => ({
    id: row[categoryCol?.field?.replace("col_", "") || ""],
    label: row[categoryCol?.field?.replace("col_", "") || ""],
    value: Number(row[valueCol?.field?.replace("col_", "") || ""]) || 0,
  }));

  return [
    {
      data: seriesData,
    },
  ];
};

const buildLineXAxisSeries = (rows: any[], gridColumns: GridColDef[]) => {
  if (gridColumns.length < 2) return [];

  const categoryCol = gridColumns[0];

  const seriesData = rows.map(
    (row) => new Date(row[categoryCol?.field?.replace("col_", "") || ""]),
  );

  console.log("line axis", categoryCol, seriesData);

  return [
    {
      scaleType: "time",
      data: seriesData,
    },
  ];
};

const buildLineChartSeries = (rows: any[], gridColumns: GridColDef[]) => {
  if (gridColumns.length < 2) return [];

  const valueCols = gridColumns.slice(1);

  return valueCols.map((valueCol, idx) => ({
    id: valueCol.field?.replace("col_", ""),
    label: valueCol.headerName,
    showMark: false,
    data: rows.map((row) => Number(Object.values(row)[idx + 1]) || 0),
  }));
};

export const DashboardChartItem = ({
  queryId,
  chartType,
}: {
  queryId: string;
  chartType: string;
}) => {
  const { data: query, isLoading: queryObjectIsLoading } =
    useQueryObject(queryId);

  console.log("query", query);

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

  console.log("data", data);

  const gridColumns: GridColDef[] = useMemo(() => {
    if (!query) return [];

    const userColumns = buildGridColumns(query);

    return [...userColumns];
  }, [query]);

  const pieSeries = useMemo(
    () => buildPieChartSeries(data?.rows || [], gridColumns),
    [data, gridColumns],
  );

  const lineXAxis = useMemo(
    () => buildLineXAxisSeries(data?.rows || [], gridColumns),
    [data, gridColumns],
  );

  const lineSeries = useMemo(
    () => buildLineChartSeries(data?.rows || [], gridColumns),
    [data, gridColumns],
  );
  console.log("lineSeries", lineSeries);

  if (chartType === "pie") {
    return <PieChart series={pieSeries} width={200} height={200} />;
  }
  if (chartType === "line") {
    return (
      <LineChart
        xAxis={lineXAxis as any}
        // yAxis={[{ scaleType: "log" }]}
        series={lineSeries}
        // dataset={data.rows || []}
        width={400}
        height={300}
      />
    );
  }
  return <div>Unsupported chart type: {chartType}</div>;
};
