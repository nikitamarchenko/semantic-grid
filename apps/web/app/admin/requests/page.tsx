"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Button, Container, Rating } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid-pro";
import {
  DataGridPro as DataGrid,
  GridFooter,
  GridFooterContainer,
  useGridApiContext,
} from "@mui/x-data-grid-pro";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import * as React from "react";

import { useAdminRequests } from "@/app/hooks/useAdminRequests";

const ROWS = 20;

const columns: GridColDef[] = [
  {
    field: "created_at",
    headerName: "Date",
    width: 200,
    sortable: true,
    valueFormatter: (params) =>
      new Date(params.value as string).toLocaleString(),
  },
  {
    field: "request",
    headerName: "Request",
    width: 500,
    sortable: true,
  },
  {
    field: "sql",
    headerName: "SQL",
    width: 500,
    sortable: false,
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 150,
    sortable: true,
    renderCell: (params) => (
      <Rating
        size="small"
        value={params.row.rating}
        max={10}
        precision={1}
        readOnly
      />
    ),
  },
  {
    field: "data",
    headerName: "CSV Data",
    width: 500,
    sortable: false,
  },
];

function exportRowsAsCSV(rows: any[]) {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((field) => JSON.stringify(row[field] ?? "")).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "selected-rows.csv");
}

const CustomFooter = () => {
  const apiRef = useGridApiContext();

  const handleExport = () => {
    const selectedIDs = apiRef.current.getSelectedRows();
    console.log(selectedIDs);
    const selectedRows = Array.from(selectedIDs.values());
    exportRowsAsCSV(selectedRows);
  };

  return (
    <GridFooterContainer>
      <Button onClick={handleExport} variant="outlined" sx={{ m: 1 }}>
        Export Selected to CSV
      </Button>
      <GridFooter />
    </GridFooterContainer>
  );
};

const regex = /```csv([\s\S]*?)```/;

const Page = withPageAuthRequired(
  () => {
    const [rowCount, setRowCount] = useState(ROWS);
    const [paginationModel, setPaginationModel] = useState({
      pageSize: ROWS,
      page: 0,
    });
    const { data, isLoading } = useAdminRequests(
      ROWS,
      paginationModel.page * ROWS,
    );
    console.log("data", data);
    useEffect(() => {
      if (data) {
        setRowCount((c) => c + (data?.length || 0));
      }
    }, [data]);

    return (
      <Container maxWidth={false} sx={{ height: "100vh", width: "100%" }}>
        <DataGrid
          loading={isLoading}
          rows={(data || []).map((r: any) => ({
            ...r,
            id: `${r.session_id}_${r.request_id}`,
            data: regex.exec(r.response)?.[1],
          }))}
          columns={columns}
          autoHeight
          density="compact"
          checkboxSelection
          pageSizeOptions={[ROWS, ROWS * 2, ROWS * 3]}
          slots={{
            footer: CustomFooter,
          }}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          rowCount={rowCount}
        />
      </Container>
    );
  },
  { returnTo: "/admin/requests" },
);

export default Page;
