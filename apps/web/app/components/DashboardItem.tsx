"use client";

import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { DashboardChartItem } from "@/app/components/DashboardChartItem";
import { DashboardTableItem } from "@/app/components/DashboardTableItem";
import { useQueryObject } from "@/app/hooks/useQueryObject";

const DashboardCard = ({
  id,
  title,
  href,
  type,
  subtype,
  queryUid,
}: {
  id: string;
  title: string;
  queryUid?: string;
  href?: string;
  type?: string;
  subtype?: string;
}) => {
  console.log("card", { id, title, href, type, subtype, queryUid });
  const { data } = useQueryObject(queryUid!);
  console.log("card query data", data);

  const inner = (
    <Card elevation={0} sx={{ minHeight: 400, minWidth: 300 }}>
      <CardActionArea component={href ? Link : "div"} href={href} sx={{ p: 2 }}>
        <CardContent>
          <Stack spacing={1} justifyContent="center">
            {type !== "create" && (
              <Typography variant="body1" color="text.primary" gutterBottom>
                {title || data?.summary}
              </Typography>
            )}
            {type === "create" && (
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ flexGrow: 1, opacity: 0.5, height: 375 }}
              >
                <Typography
                  variant="h1"
                  component="div"
                  sx={{ fontSize: 64, lineHeight: 1 }}
                >
                  +
                </Typography>
                <Typography variant="body1">Add New</Typography>
              </Stack>
            )}
            {type === "chart" && queryUid && (
              <DashboardChartItem
                queryUid={queryUid}
                chartType={subtype || "pie"}
              />
            )}
            {type === "table" && queryUid && (
              <DashboardTableItem queryUid={queryUid} />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return inner;
};

export default DashboardCard;
