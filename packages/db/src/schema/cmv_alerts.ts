import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { cmvIngredients } from "./cmv_ingredients.js";
import { cmvSuppliers } from "./cmv_suppliers.js";

export const cmvAlerts = pgTable(
  "cmv_alerts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    alertType: text("alert_type").notNull(), // "price_increase" | "cmv_deviation" | "safety_margin" | "stock_out"
    // "low" | "medium" | "high" | "urgent"
    severity: text("severity").notNull(),
    message: text("message").notNull(),
    impactCents: integer("impact_cents"),
    ingredientId: uuid("ingredient_id").references(() => cmvIngredients.id),
    supplierId: uuid("supplier_id").references(() => cmvSuppliers.id),
    createdByAgentId: text("created_by_agent_id"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyCreatedIdx: index("cmv_alerts_company_created_idx").on(
      table.companyId,
      table.createdAt,
    ),
    companyResolvedIdx: index("cmv_alerts_company_resolved_idx").on(
      table.companyId,
      table.resolvedAt,
    ),
  }),
);

export type CmvAlert = typeof cmvAlerts.$inferSelect;
export type NewCmvAlert = typeof cmvAlerts.$inferInsert;
