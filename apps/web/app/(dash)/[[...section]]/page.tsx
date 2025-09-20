// app/(dash)/[[...section]]/page.tsx
import type { Metadata } from "next";

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
  const dMeta = await getDashboardByPath(slugPath);
  const d = await getDashboardData(dMeta?.id || "");

  // map to DashboardGrid items

  const items =
    (d as any).items?.map(
      (it: DashboardItem & { query: { queryUid: string } }) => ({
        key: it.id,
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
  });

  console.log("Dashboard items:", slugPath, items);

  return (
    <DashboardGrid
      title={dMeta?.name}
      description={dMeta?.description || undefined}
      items={items}
    />
  );
};

export default Page;
