import { DashboardItemPage } from "@/app/components/DashboardItemPage";
import { getDashboardItemData } from "@/app/lib/dashboards";
import { getQuery } from "@/app/lib/gptAPI";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const item = await getDashboardItemData(id);
  const query = await getQuery({ queryId: item.query?.queryUid });

  return (
    <DashboardItemPage
      id={id}
      query={query || undefined}
      itemType={item?.itemType || "table"}
      chartType={item?.chartType || undefined}
      name={item.name || undefined}
    />
  );
};

export default Page;
