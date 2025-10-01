// app/(dash)/[[...section]]/page.tsx
import { getSession } from "@auth0/nextjs-auth0";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import type { Metadata } from "next";
import Link from "next/link";

import DashboardGrid from "@/app/components/DashboardGrid";
import type { DashboardItem } from "@/app/lib/dashboards";
import { getDashboardByPath, getDashboardData } from "@/app/lib/dashboards";

function pathFromParams(params: { section?: string[] }) {
  // /            -> ''
  // /tokens      -> 'tokens'
  // /trends/...  -> 'trends'
  // const seg = params.section?.[0] ?? ""; // first segment only
  // return `/${seg}`; // '' -> '/', else '/tokens'
  return params.section ? `/${params.section.join("/")}` : ""; // '' -> '/', else '/tokens'
}

export async function generateMetadata({
  params,
}: {
  params: { section?: string[] };
}): Promise<Metadata> {
  const d = await getDashboardByPath(pathFromParams(params));
  return { title: `ApeGPT | ${d?.name || "Home"}` };
}

const typeToHash = (type: string) => {
  switch (type) {
    case "chart":
      return "chart";
    case "table":
    default:
      return "grid";
  }
};

const Page = async ({ params }: { params: { section?: string[] } }) => {
  const slugPath = pathFromParams(params); // '/' | '/tokens' | '/trends' | '/traders' | '/user'
  const isUserPage = slugPath.startsWith("/user/");
  const dMeta = await getDashboardByPath(slugPath);
  const d = await getDashboardData(dMeta?.id || "");
  const session = await getSession();

  // map to DashboardGrid items

  const items =
    (d as any).items?.map(
      (it: DashboardItem & { query: { queryUid: string } }) => ({
        key: it.id,
        position: it.position,
        title: it.description || it.name || "",
        id: it.id,
        href: it.query?.queryUid
          ? `/item/${it.id}#${typeToHash(it.itemType || it.type || "table")}`
          : undefined,
        type: it.type || it.itemType,
        subtype: it.chartType,
        queryUid: it.query?.queryUid,
      }),
    ) ?? [];

  items.push({
    key: "create",
    title: "Create new",
    type: "create",
    href: "/grid",
    position: Number.MAX_SAFE_INTEGER,
  });

  console.log("Dashboard items:", slugPath, items);

  return !isUserPage || session ? (
    <DashboardGrid
      slugPath={slugPath}
      title={dMeta?.name}
      description={dMeta?.description || undefined}
      items={items}
      maxItemsPerRow={dMeta?.maxItemsPerRow || 3}
    />
  ) : (
    <Container maxWidth="md" sx={{ height: "80vh" }}>
      <Paper elevation={0} sx={{ height: "100%" }}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 8, height: "100%" }}
        >
          <Typography>
            Please log in to create, edit and view custom dashboards
          </Typography>
          <Button
            component={Link}
            href={`/api/auth/login?returnTo=${slugPath}`}
            variant="contained"
            size="large"
          >
            Log In
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Page;
