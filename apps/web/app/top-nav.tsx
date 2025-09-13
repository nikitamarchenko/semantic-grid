import { getDashboards } from "@/app/lib/appApi";

import TopNavClient from "./components/TopNavClient";

// Optional caching: choose one based on your data
// export const revalidate = 300;         // ISR every 5 min
// export const dynamic = "force-dynamic"; // always dynamic
// export const dynamic = "force-static";  // fully static

const TopNav = async () => {
  const dashboards = await getDashboards();
  return <TopNavClient dashboards={dashboards} />;
};

export default TopNav;
