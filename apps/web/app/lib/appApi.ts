/*
export const getDashboards = async () => {
  // check permissions, auth, etc. here as needed
  // Simulate an API call delay
  console.log("Fetching dashboards API...");

  return Promise.resolve(dashboards);
};

export const getDashboardByPath = async (path: string) => {
  // path like "/tokens" => dashboard id
  const d = dashboards.find((x) => x.slug === path);
  if (!d) throw new Error("Dashboard not found");
  return d;
};

export const getDashboardData = async (id: string) => {
  // check permissions, auth, etc. here as needed
  // Simulate an API call delay
  console.log(`Fetching dashboard ${id} API...`);
  const dashboard = dashboards.find((d) => d.id === id);
  if (!dashboard) {
    throw new Error("Dashboard not found");
  }
  const items: DashboardItem[] = dashboardItems.filter(
    (item) => item.dashboardId === id,
  );
  // In a real implementation, you'd fetch and attach the actual query data here
  (dashboard as any).items = items.map((item) => ({
    ...item,
    query: queries.find((q) => q.id === item.queryId) || null,
  }));

  return Promise.resolve(dashboard);
};

export const getDashboardItemData = async (id: string) => {
  const item = dashboardItems.find((d) => d.id === id);
  if (!item) return Promise.reject(new Error(`Dashboard not found: ${id}`));

  return Promise.resolve({
    ...item,
    query: queries.find((q) => q.id === item.queryId) || null,
  });
};

 */
