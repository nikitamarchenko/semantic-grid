"use server";

import { readFile } from "node:fs/promises";

import * as jose from "jose";
import { stringify } from "qs-esm";

import type { Dashboard, DashboardItem } from "@/app/lib/payload-types";

export const getFromPayload = async (collection: string, query?: string) => {
  const url = new URL(
    `/api/payload/api/${collection}${query || ""}`,
    process.env.PAYLOAD_API_URL,
  );
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(
      `Error fetching from Payload: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
};

export const postToPayload = async (collection: string, data: any) => {
  const url = new URL(
    `/api/payload/api/${collection}`,
    process.env.PAYLOAD_API_URL,
  );
  const res = await fetch(url.toString(), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(
      `Error posting to Payload: ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
};

export const getDashboards = async (userId?: string) => {
  if (!userId) {
    const where = {};
    const query = stringify(
      {
        where,
        limit: 1000,
        sort: "createdAt",
      },
      { addQueryPrefix: true },
    );
    const dashboards = await getFromPayload("dashboards", query).then(
      (r) => r?.docs || [],
    );
    return dashboards.map((d: Dashboard) => ({
      ...d,
      layout: {
        i: d.id,
        x: 0,
        y: 0,
        w: 12 / ((d as any).maxItemsPerRow || 3),
        h: 2,
        static: true,
      },
      // slug: d.slug.startsWith("/user") ? "/user" : d.slug,
    }));
  }
  const where = {
    or: [
      { ownerUserId: { equals: userId } },
      { ownerUserId: { equals: null } },
    ],
  };
  const query = stringify(
    {
      where,
      limit: 1000,
      sort: "createdAt",
    },
    { addQueryPrefix: true },
  );
  const userDashboards = await getFromPayload("dashboards", query).then(
    (r) => r?.docs || [],
  );
  return userDashboards.map((d: Dashboard) => ({
    ...d,
    layout: {
      i: d.id,
      x: 0,
      y: 0,
      w: 12 / ((d as any).maxItemsPerRow || 3),
      h: 2,
      static: true,
    },
    // slug: d.slug.startsWith("/user") ? "/user" : d.slug,
  }));
};

export const getDashboardByPath = async (path: string) => {
  // const slug = path.startsWith("/user") ? "/user" : path;
  const where = { slug: { equals: path || "/" } };
  const query = stringify(
    {
      where,
      limit: 1,
    },
    { addQueryPrefix: true },
  );
  const [found] = await getFromPayload("dashboards", query).then(
    (r) => r?.docs || [],
  );
  return found || null;
};

export const getDashboardData = async (id: string) => {
  // Fetch dashboard
  const where = { id: { equals: id } };
  const query = stringify(
    {
      where,
      limit: 1,
    },
    { addQueryPrefix: true },
  );
  const dashboards = await getFromPayload("dashboards", query).then(
    (r) => r?.docs || [],
  );
  if (!dashboards[0]) {
    throw new Error(`Dashboard not found: ${id}`);
  }

  return {
    ...dashboards[0],
    layout: dashboards[0].items?.map((it: DashboardItem, idx: number) => ({
      i: it.id,
      x:
        (idx % (dashboards[0].maxItemsPerRow || 3)) *
        (12 / (dashboards[0].maxItemsPerRow || 3)),
      y: Math.floor(idx / (dashboards[0].maxItemsPerRow || 3)) * 2,
      w: 12 / (dashboards[0].maxItemsPerRow || 3),
      h: (12 * 3) / ((dashboards[0].maxItemsPerRow || 3) * 4),
      // static: true,
    })),
  };
};

export const getDashboardItemData = async (id: string) => {
  const where = { id: { equals: id } };
  const query = stringify(
    {
      where,
      limit: 1,
    },
    { addQueryPrefix: true },
  );
  const [row] = await getFromPayload("dashboard_items", query).then(
    (r) => r?.docs || [],
  );

  if (!row) {
    throw new Error(`Dashboard item not found: ${id}`);
  }

  return row;
};

const getQuery = async ({ queryUid }: { queryUid: string }) => {
  const where = { queryUid: { equals: queryUid } };
  const query = stringify(
    {
      where,
      limit: 1,
    },
    { addQueryPrefix: true },
  );
  const [row] = await getFromPayload("queries", query).then(
    (r) => r?.docs || [],
  );
  return row || null;
};

export const upsertQuery = async (input: {
  queryUid: string;
  description?: string;
}) => {
  /*
  // Try to find by queryUid, else insert
  const existing = await db
    .select()
    .from(queries)
    .where(eq(queries.queryUid, input.queryUid as any));
  if (existing[0]) {
    const [upd] = await db
      .update(queries)
      .set({ description: input.description })
      .where(eq(queries.id, existing[0].id))
      .returning();
    return upd;
  }
  const [row] = await db
    .insert(queries)
    .values({ queryUid: input.queryUid as any, description: input.description })
    .returning();
  return row;

   */
};

export const changeDefaultView = async (input: {
  itemId: string;
  itemType: "chart" | "table" | string;
  chartType?: string;
}) => {
  /*
  const [row] = await db
    .update(dashboardItems)
    .set({
      itemType: input.itemType as any,
      chartType: input.chartType,
    })
    .where(eq(dashboardItems.id, input.itemId))
    .returning();
  return row ?? null; // null if already attached

   */
};

export const attachQueryToDashboard = async (input: {
  dashboardId: string;
  queryUid: string;
  name?: string;
  description?: string;
  itemType: "chart" | "table";
  chartType?: string;
  position?: number;
}) => {
  /*
  const q = await upsertQuery({
    queryUid: input.queryUid,
    description: input.description || "",
  });
  const [row] = await db
    .insert(dashboardItems)
    .values({
      dashboardId: input.dashboardId as any,
      queryId: q?.id as any,
      name: input.name,
      description: input.description,
      itemType: input.itemType,
      chartType: input.chartType,
      position: input.position ?? 0,
    })
    .onConflictDoNothing()
    .returning();
  return row ?? null; // null if already attached

   */
};

export const attachQueryToUserDashboard = async (input: {
  userId: string;
  queryUid: string;
  itemType: "chart" | "table";
  chartType?: string;
  position?: number;
}) => {
  /*
  const q = await getQuery({
    queryUid: input.queryUid,
  }).then((r) => r[0] || null);
  // Find user's personal dashboard
  const [d] = await db
    .select()
    .from(dashboards)
    .where(eq(dashboards.ownerUserId, input.userId as any));
  if (!d) {
    throw new Error("User dashboard not found");
  }
  // Attach to it
  const [row] = await db
    .insert(dashboardItems)
    .values({
      dashboardId: d.id as any,
      queryId: q?.id as any,
      itemType: input.itemType,
      chartType: input.chartType,
      position: input.position ?? 0,
    })
    .onConflictDoNothing()
    .returning();
  return row ?? null; // null if already attached

   */
};

export const detachQueryFromDashboard = async (
  dashboardId: string,
  queryUid: string,
) => {
  /*
  const q = await db
    .select()
    .from(queries)
    .where(eq(queries.queryUid, queryUid as any));
  if (!q[0]) return 0;
  const res = await db
    .delete(dashboardItems)
    .where(
      and(
        eq(dashboardItems.dashboardId, dashboardId as any),
        eq(dashboardItems.queryId, q[0].id as any),
      ),
    );
  return res.length ?? 0;

   */
};

// Paths provided via env (point to mounted files)
const PUB_PATH = process.env.JWT_PUBLIC_KEY!;

// simple in-memory cache for the PEMs & CryptoKeys
let pubPem: string | undefined;
let pubKey: CryptoKey | undefined;

async function getPublicKey(): Promise<CryptoKey> {
  if (pubKey) return pubKey;
  if (!pubPem) {
    try {
      pubPem = (await readFile(PUB_PATH, "utf8")).trim();
    } catch (e) {
      pubPem = process.env.JWT_PUBLIC_KEY!;
    }
  }
  // Basic sanity check to avoid the SPKI error
  if (!pubPem.includes("-----BEGIN PUBLIC KEY-----")) {
    throw new Error("Public key must be SPKI PEM (BEGIN PUBLIC KEY)");
  }
  pubKey = await jose.importSPKI(pubPem, "RS256");
  return pubKey;
}

export const ensureUserAndDashboard = async (opts: { sid?: string }) => {
  let uid: string | undefined;
  let userId: string | undefined;
  console.log("ensureUserAndDashboard:", opts);

  if (opts.sid) {
    try {
      const publicKey = await getPublicKey();
      const jwt = await jose.jwtVerify(opts.sid, publicKey);
      console.log("Verified guest JWT", jwt);
      userId = jwt.payload?.sub;
    } catch {
      throw new Error("Invalid session");
      // no or invalid token?
    }
  }

  if (!userId) {
    // No user ID, return no-op
    return { uid: null, userId: null, dashboardId: null };
  }

  const whereDash = { ownerUserId: { equals: uid || null } };
  const queryDash = stringify(
    {
      where: whereDash,
      limit: 1,
    },
    { addQueryPrefix: true },
  );
  const [dash] = await getFromPayload("dashboards", queryDash).then(
    (r) => r?.docs || [],
  );
  const dashId = dash?.id;
  if (!dashId) {
    // Create empty dashboard
    const userDashboard = {
      id: null as unknown,
      name: "My Dashboard",
      slug: `/user/${userId}`,
      ownerUserId: userId,
      description: "Personal dashboard",
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Dashboard;
    const res = await postToPayload("dashboards", userDashboard);
    console.log("Created user dashboard", res);
  }

  return { uid, userId, dashboardId: dashId };
};
