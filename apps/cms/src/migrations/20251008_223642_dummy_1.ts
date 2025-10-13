import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Migration code
  await db.execute(sql`
   CREATE UNIQUE INDEX "dashboards_owner_user_id_idx" ON "dashboards" USING btree ("owner_user_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Migration code
  await db.execute(sql`
   DROP INDEX "dashboards_owner_user_id_idx";`)
}
