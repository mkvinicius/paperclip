import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const cmvRecipes = pgTable(
  "cmv_recipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    name: text("name").notNull(),
    category: text("category"),
    sellingPriceCents: integer("selling_price_cents"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index("cmv_recipes_company_idx").on(table.companyId),
    companyNameIdx: index("cmv_recipes_company_name_idx").on(table.companyId, table.name),
  }),
);

export type CmvRecipe = typeof cmvRecipes.$inferSelect;
export type NewCmvRecipe = typeof cmvRecipes.$inferInsert;
