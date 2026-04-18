import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { cmvSuppliers } from "./cmv_suppliers.js";

export const cmvPurchases = pgTable(
  "cmv_purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    supplierId: uuid("supplier_id").references(() => cmvSuppliers.id),
    invoiceDate: timestamp("invoice_date", { withTimezone: true }).notNull(),
    totalAmountCents: integer("total_amount_cents").notNull(),
    invoiceNumber: text("invoice_number"),
    nfeKey: text("nfe_key"), // 44-digit NF-e access key
    // "photo" | "xml_nfe" | "pdf" | "text" | "voice" | "manual"
    sourceType: text("source_type").notNull().default("manual"),
    rawData: text("raw_data"),
    confirmedByUserId: text("confirmed_by_user_id"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyInvoiceDateIdx: index("cmv_purchases_company_invoice_date_idx").on(
      table.companyId,
      table.invoiceDate,
    ),
    companySupplierIdx: index("cmv_purchases_company_supplier_idx").on(
      table.companyId,
      table.supplierId,
    ),
  }),
);

export type CmvPurchase = typeof cmvPurchases.$inferSelect;
export type NewCmvPurchase = typeof cmvPurchases.$inferInsert;
