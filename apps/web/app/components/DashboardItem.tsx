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
import { DashboardItemMenu } from "@/app/components/DashboardItemMenu";
import { DashboardTableItem } from "@/app/components/DashboardTableItem";
import { useQuery } from "@/app/hooks/useQuery";
import { useQueryObject } from "@/app/hooks/useQueryObject";

const DashboardCard = ({
  id,
  title,
  href,
  type,
  subtype,
  queryUid,
  slugPath,
  maxItemsPerRow,
}: {
  id: string;
  title: string;
  queryUid?: string;
  href?: string;
  type?: string;
  subtype?: string;
  slugPath: string;
  maxItemsPerRow: number;
}) => {
  // console.log("card", { id, title, href, type, subtype, queryUid });
  const { data } = useQueryObject(queryUid!);
  // console.log("card query data", data);
  const minHeight = maxItemsPerRow ? 400 * (3 / maxItemsPerRow) : 400;
  const { refresh, fetchedAt } = useQuery({
    id: queryUid,
    sql: data?.sql,
    limit: 20,
    offset: 0,
  });

  const inner = (
    <Card
      elevation={0}
      sx={{
        minHeight,
        minWidth: 300,
      }}
    >
      <CardActionArea component={href ? Link : "div"} href={href} sx={{ p: 2 }}>
        <CardContent>
          <Stack spacing={1} justifyContent="center">
            {type !== "create" && (
              <Stack
                direction="row"
                alignItems="top"
                justifyContent="space-between"
              >
                <Typography variant="body1" color="text.primary" gutterBottom>
                  {title || data?.summary}
                </Typography>
                {data && (
                  <DashboardItemMenu
                    id={id}
                    query={data}
                    slugPath={slugPath}
                    refresh={refresh}
                    fetchedAt={fetchedAt || undefined}
                  />
                )}
              </Stack>
            )}
            {type === "create" && (
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ flexGrow: 1, opacity: 0.5, height: minHeight }}
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
                minHeight={minHeight}
              />
            )}
            {type === "table" && queryUid && (
              <DashboardTableItem queryUid={queryUid} minHeight={minHeight} />
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return inner;
};

export default DashboardCard;
