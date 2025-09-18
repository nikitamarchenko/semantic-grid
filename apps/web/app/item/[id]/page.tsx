import { DashboardItemPage } from "@/app/components/DashboardItemPage";
import { getDashboardItemData } from "@/app/lib/appApi";
import { getQuery } from "@/app/lib/gptAPI";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const item = await getDashboardItemData(id);
  const query = await getQuery({ queryId: item.query?.queryId });

  return (
    <DashboardItemPage
      id={id}
      query={query || undefined}
      chartType={item?.chartType}
      name={item.name}
    />
  );
};

export default Page;
