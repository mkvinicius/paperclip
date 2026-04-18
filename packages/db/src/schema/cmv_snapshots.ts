import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const cmvSnapshots = pgTable(
  "cmv_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    // CMV percentages in basis points: 3200 = 32.00%
    theoreticalCmvBps: integer("theoretical_cmv_bps"),
    actualCmvBps: integer("actual_cmv_bps"),
    deviationBps: integer("deviation_bps"),
    faturamentoCents: integer("faturamento_cents"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyPeriodIdx: index("cmv_snapshots_company_period_idx").on(
      table.companyId,
      table.periodStart,
    ),
  }),
);

export type CmvSnapshot = typeof cmvSnapshots.$inferSelect;
export type NewCmvSnapshot = typeof cmvSnapshots.$inferInsert;
