import { pgTable, uuid, text, integer, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const cmvIngredients = pgTable(
  "cmv_ingredients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    name: text("name").notNull(),
    unit: text("unit").notNull(), // "kg", "L", "un", "g", etc.
    currentPriceCents: integer("current_price_cents"),
    lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index("cmv_ingredients_company_idx").on(table.companyId),
    companyNameIdx: uniqueIndex("cmv_ingredients_company_name_idx").on(table.companyId, table.name),
  }),
);

export type CmvIngredient = typeof cmvIngredients.$inferSelect;
export type NewCmvIngredient = typeof cmvIngredients.$inferInsert;
