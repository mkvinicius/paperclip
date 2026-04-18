import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

export const cmvSuppliers = pgTable(
  "cmv_suppliers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    name: text("name").notNull(),
    category: text("category"),
    contactInfo: text("contact_info"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index("cmv_suppliers_company_idx").on(table.companyId),
    companyNameIdx: index("cmv_suppliers_company_name_idx").on(table.companyId, table.name),
  }),
);

export type CmvSupplier = typeof cmvSuppliers.$inferSelect;
export type NewCmvSupplier = typeof cmvSuppliers.$inferInsert;
