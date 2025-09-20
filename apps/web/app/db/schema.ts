import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const itemTypeEnum = pgEnum("dashboard_item_type", ["chart", "table"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  uid: text("uid").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const dashboards = pgTable("dashboards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  ownerUserId: uuid("owner_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    // @ts-ignore
    .default(null),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const queries = pgTable("queries", {
  id: uuid("id").defaultRandom().primaryKey(),
  queryUid: uuid("query_uid").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const dashboardItems = pgTable(
  "dashboard_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    description: text("description"),
    dashboardId: uuid("dashboard_id")
      .notNull()
      .references(() => dashboards.id, { onDelete: "cascade" }),
    queryId: uuid("query_id")
      .notNull()
      .references(() => queries.id, { onDelete: "cascade" }),
    itemType: itemTypeEnum("item_type").notNull(),
    chartType: text("chart_type"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniqDashQuery: { columns: [t.dashboardId, t.queryId], unique: true },
  }),
);

export const dashboardsRelations = relations(dashboards, ({ many }) => ({
  items: many(dashboardItems),
}));

export const queriesRelations = relations(queries, ({ many }) => ({
  items: many(dashboardItems),
}));

export const dashboardItemsRelations = relations(dashboardItems, ({ one }) => ({
  dashboard: one(dashboards, {
    fields: [dashboardItems.dashboardId],
    references: [dashboards.id],
  }),
  query: one(queries, {
    fields: [dashboardItems.queryId],
    references: [queries.id],
  }),
}));
