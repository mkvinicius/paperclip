import { pgTable, uuid, text, integer, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const cmvBusinessProfiles = pgTable(
  "cmv_business_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    businessType: text("business_type").notNull(),
    avgSalePriceCents: integer("avg_sale_price_cents"),
    monthlyFixedCostsCents: integer("monthly_fixed_costs_cents"),
    // CMV target stored in basis points: 3200 = 32.00%
    cmvTargetBps: integer("cmv_target_bps").notNull().default(3200),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index("cmv_business_profiles_company_idx").on(table.companyId),
    companyUniqueIdx: uniqueIndex("cmv_business_profiles_company_unique_idx").on(table.companyId),
  }),
);

export type CmvBusinessProfile = typeof cmvBusinessProfiles.$inferSelect;
export type NewCmvBusinessProfile = typeof cmvBusinessProfiles.$inferInsert;
