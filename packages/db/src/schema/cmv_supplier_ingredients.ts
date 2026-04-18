import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { cmvSuppliers } from "./cmv_suppliers.js";
import { cmvIngredients } from "./cmv_ingredients.js";

export const cmvSupplierIngredients = pgTable(
  "cmv_supplier_ingredients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    supplierId: uuid("supplier_id").notNull().references(() => cmvSuppliers.id),
    ingredientId: uuid("ingredient_id").notNull().references(() => cmvIngredients.id),
    pricePerUnitCents: integer("price_per_unit_cents").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index("cmv_supplier_ingredients_company_idx").on(table.companyId),
    supplierIngredientIdx: index("cmv_supplier_ingredients_supplier_ingredient_idx").on(
      table.supplierId,
      table.ingredientId,
    ),
    ingredientRecordedIdx: index("cmv_supplier_ingredients_ingredient_recorded_idx").on(
      table.ingredientId,
      table.recordedAt,
    ),
  }),
);

export type CmvSupplierIngredient = typeof cmvSupplierIngredients.$inferSelect;
export type NewCmvSupplierIngredient = typeof cmvSupplierIngredients.$inferInsert;
