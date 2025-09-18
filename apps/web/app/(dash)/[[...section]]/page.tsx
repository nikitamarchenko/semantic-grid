// app/(dash)/[[...section]]/page.tsx
import type { Metadata } from "next";

import DashboardGrid from "@/app/components/DashboardGrid";
import type { DashboardItem } from "@/app/lib/appApi";
import { getDashboardByPath, getDashboardData } from "@/app/lib/appApi";

function pathFromParams(params: { section?: string[] }) {
  // /            -> ''
  // /tokens      -> 'tokens'
  // /trends/...  -> 'trends'
  const seg = params.section?.[0] ?? ""; // first segment only
  return `/${seg}`; // '' -> '/', else '/tokens'
}

export async function generateMetadata({
  params,
}: {
  params: { section?: string[] };
}): Promise<Metadata> {
  const d = await getDashboardByPath(pathFromParams(params));
  return { title: `ApeGPT | ${d.name}` };
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
  const d = await getDashboardData(dMeta.id);

  // map to DashboardGrid items

  const items =
    (d as any).items?.map(
      (it: DashboardItem & { query: { queryId: string } }) => ({
        key: it.id,
        title: it.description || it.name || "Item",
        id: it.id,
        // href: it.query?.queryId ? `/q/${it.query?.queryId}` : undefined,
        // href: it.query?.queryId ? `/query?q=${it.query?.queryId}` : undefined,
        href: it.query?.queryId
          ? `/item/${it.id}#${typeToHash(it.type)}`
          : undefined,
        type: it.type,
        subtype: it.chartType,
        queryId: it.query?.queryId,
      }),
    ) ?? [];

  items.push({
    key: "create",
    title: "Create new",
    type: "create",
    href: "#",
  });

  return (
    <DashboardGrid
      title={dMeta.name}
      description={dMeta.description}
      items={items}
    />
  );
};

export default Page;
