import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { cmvPurchases } from "./cmv_purchases.js";
import { cmvIngredients } from "./cmv_ingredients.js";

export const cmvPurchaseItems = pgTable(
  "cmv_purchase_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    purchaseId: uuid("purchase_id").notNull().references(() => cmvPurchases.id),
    ingredientId: uuid("ingredient_id").notNull().references(() => cmvIngredients.id),
    // Quantity stored in milli-units to avoid decimals: 1500 = 1.500 kg
    quantityMilli: integer("quantity_milli").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    totalPriceCents: integer("total_price_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    purchaseIdx: index("cmv_purchase_items_purchase_idx").on(table.purchaseId),
    companyIngredientIdx: index("cmv_purchase_items_company_ingredient_idx").on(
      table.companyId,
      table.ingredientId,
    ),
  }),
);

export type CmvPurchaseItem = typeof cmvPurchaseItems.$inferSelect;
export type NewCmvPurchaseItem = typeof cmvPurchaseItems.$inferInsert;
