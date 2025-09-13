export type Dashboard = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardItem = {
  id: string;
  name?: string;
  description?: string;
  dashboardId: string;
  queryId: string;
  type: "chart" | "table" | "both";
  chartType?: string; // e.g., 'bar', 'line', etc.
  createdAt: string;
  updatedAt: string;
};

export type Query = {
  id: string;
  queryId: string; // reference to the actual query object
  description?: string;
  createdAt: string;
  updatedAt: string;
};

const dashboards: Dashboard[] = [
  {
    id: "1",
    name: "Home",
    slug: "/",
    description: "Solana DEX Activity At a Glance.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Tokens",
    slug: "/tokens",
    description: "Most Performing Tokens and Market Trends.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Trends",
    slug: "/trends",
    description: "What's Hot On The Market Today.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Traders",
    slug: "/traders",
    description: "Wallets Making Waves and Profit",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "99999",
    name: "User",
    slug: "/user",
    description: "Your Personal Dashboard.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const queries: Query[] = [
  {
    id: "q1",
    queryId: "8ee0c689-3853-4052-9e9f-a52fde8c881d",
    description: "WSOL Trading Volume For the Past 7 Days",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q2",
    // queryId: "a6bf97ff-4d8c-48f2-9c2a-ecf90e06dcf5",
    queryId: "82603d68-9f16-4752-a5b0-84c9bd079a34",
    description: "Top 20 Trading Tokens",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q3",
    queryId: "0184da22-0dab-4aee-843c-01aaf035c891",
    description: "DEX Trades For The Past 7 Days",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q4",
    queryId: "388a053f-aedf-44da-83dc-c99d0c24ba19",
    description: "Top 10 Traders For the Past 24h",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q5",
    queryId: "91406c57-6fb1-4025-8a92-5d51af6e3f65",
    description: "Tokens traded for last 7 days",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q6",
    queryId: "0fca1837-2685-4e27-a0d1-e822350c842a",
    description: "WSOL buys and sells for last 7 days",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q7",
    queryId: "642dfc7b-b1dc-407c-90ef-cf5104e40f6b",
    description: "High-Traded Tokens For the Past 7 Days",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q71",
    queryId: "432af35d-06e8-4a45-87be-9d593af923c7",
    description: "High-Traded Tokens For the Past 24H",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q8",
    queryId: "dc2c9190-530f-40e1-8c0c-7637e2c85e69",
    description: "DEX Volumes For the Past 7 Days",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q9",
    queryId: "fb497a12-5679-46e4-a5f7-99ae49c63e68",
    description: "TX Count, 7 Days",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q10",
    queryId: "10bf2379-6d58-4e1a-8fcc-6dcb45b33fd0",
    description: "Top 10 USDC Spenders, 24H",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const dashboardItems: DashboardItem[] = [
  {
    id: "d0",
    dashboardId: "1",
    queryId: "q9",
    description: "TX Count, 7 Days",
    name: "TX Count, 7 Days",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di1-1",
    dashboardId: "1",
    queryId: "q1",
    description: "WSOL Trading Volume For the Past 7 Days",
    name: "WSOL Trading Volume For the Past 7 Days",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di1-2",
    dashboardId: "1",
    queryId: "q6",
    description: "WSOL buys and sells for last 7 days",
    name: "WSOL buys and sells for last 7 days",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di1-3",
    dashboardId: "1",
    queryId: "q7",
    description: "High-Traded Tokens, 7D",
    name: "High-Traded Tokens, 7D",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di2",
    dashboardId: "2",
    queryId: "q2",
    name: "Top 20 Traded Tokens, 7D",
    description: "Top 20 Traded Tokens, 7D",
    type: "table",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di2-2",
    dashboardId: "1",
    queryId: "q71",
    name: "High Traded Tokens, 24H",
    description: "High Traded Tokens, 24H",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di2-1",
    dashboardId: "2",
    queryId: "q2",
    name: "Top 20 Traded Tokens",
    description: "Top 20 Traded Tokens",
    type: "chart",
    chartType: "pie",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di3",
    dashboardId: "1",
    queryId: "q3",
    name: "DEX Trades For The Past 7 Days",
    description: "DEX Trades For The Past 7 Days",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di9",
    dashboardId: "1",
    queryId: "q8",
    description: "DEX Volumes For the Past 7 Days",
    name: "DEX Volumes For the Past 7 Days",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di4",
    dashboardId: "4",
    queryId: "q4",
    name: "Top 10 Traders For the Past 24h",
    description: "Top 10 Traders For the Past 24h",
    type: "chart",
    chartType: "pie",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di5",
    dashboardId: "3",
    queryId: "q5",
    name: "Tokens traded for last 7 days",
    description: "Tokens traded for last 7 days",
    type: "chart",
    chartType: "line",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "di6",
    dashboardId: "4",
    queryId: "q10",
    description: "Top 10 USDC Spenders, 24H",
    name: "Top 10 USDC Spenders, 24H",
    type: "chart",
    chartType: "pie",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
