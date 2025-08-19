import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import React, { useState } from "react";

import {
  isNumber,
  isSolanaAddress,
  isSolanaSignature,
  maybeDate,
} from "@/app/helpers/cell";

const handleLinkClick = (e: { stopPropagation: () => void }) => {
  e.stopPropagation();
};

const StyledValue = ({ value }: { value: string }) => {
  // Trim the value to remove extra spaces
  const trimmedValue = value.trim();

  // Check if the trimmed value is a date
  const maybeDateValue = maybeDate(trimmedValue);
  if (maybeDateValue) {
    const formattedDate = format(maybeDateValue, "MM-dd-yy HH:mm:ss");
    return <span style={{ whiteSpace: "nowrap" }}>{formattedDate}</span>; // Convert to a date
  }

  // Check if the trimmed value is a number
  const maybeNumber = Number(trimmedValue);
  if (!Number.isNaN(maybeNumber)) {
    return (
      <span
        style={{ display: "inline-block", width: "100%", textAlign: "end" }}
      >
        {maybeNumber.toLocaleString()}
      </span>
    ); // Convert to a number
  }
  if (isSolanaAddress(trimmedValue)) {
    return (
      <Box
        component="a"
        href={`https://solscan.io/account/${trimmedValue}`}
        target="_blank"
        sx={{ "&:hover": { color: (theme) => theme.palette.primary.main } }}
        onClick={handleLinkClick}
      >
        {trimmedValue}
      </Box>
    );
  }
  if (isSolanaSignature(trimmedValue)) {
    return (
      <Box
        component="a"
        href={`https://solscan.io/tx/${trimmedValue}`}
        target="_blank"
        sx={{ "&:hover": { color: (theme) => theme.palette.primary.main } }}
        onClick={handleLinkClick}
      >
        {trimmedValue}
      </Box>
    );
  }
  return <span>{value}</span>; // Return as-is if not a date or solana address or number
};

export const parseCsv = (csvData: string) => {
  const rows = csvData.trim().split("\n");
  return rows.map((row: string) => row.split(",").map((cell) => cell.trim()));
};

const CsvTable = ({ csvData }: { csvData: string }) => {
  const tableData = parseCsv(csvData);
  const [showAll, setShowAll] = useState(tableData.length < 12 - 5);
  const handleShowMore = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setShowAll(() => true);
  };

  return (
    <Box style={{ padding: "16px" }}>
      {tableData && tableData.length > 0 && (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                {tableData[0]?.map((header, index) => (
                  <TableCell key={header}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "100%",
                        textAlign: isNumber(tableData?.[1]?.[index])
                          ? "end"
                          : "start",
                      }}
                    >
                      {header
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                .slice(1, showAll ? undefined : 11 - 5)
                .map((row, rowIndex) => (
                  <TableRow key={row.join("_")}>
                    {row.map((cell, cellIndex) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableCell key={`${cell}_${cellIndex}`}>
                        <StyledValue value={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!showAll && (
        <Button
          onClick={handleShowMore}
          // variant="contained"
          sx={{ display: "block", margin: "2rem auto" }}
        >
          Show More
        </Button>
      )}
    </Box>
  );
};

export default CsvTable;
