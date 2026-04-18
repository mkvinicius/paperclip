-- CMV (Custo de Mercadoria Vendida) schema migration

CREATE TABLE IF NOT EXISTS "cmv_business_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "business_type" text NOT NULL,
  "avg_sale_price_cents" integer,
  "monthly_fixed_costs_cents" integer,
  "cmv_target_bps" integer NOT NULL DEFAULT 3200,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_business_profiles_company_idx" ON "cmv_business_profiles" ("company_id");
CREATE UNIQUE INDEX "cmv_business_profiles_company_unique_idx" ON "cmv_business_profiles" ("company_id");

CREATE TABLE IF NOT EXISTS "cmv_ingredients" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "name" text NOT NULL,
  "unit" text NOT NULL,
  "current_price_cents" integer,
  "last_updated_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_ingredients_company_idx" ON "cmv_ingredients" ("company_id");
CREATE UNIQUE INDEX "cmv_ingredients_company_name_idx" ON "cmv_ingredients" ("company_id", "name");

CREATE TABLE IF NOT EXISTS "cmv_suppliers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "name" text NOT NULL,
  "category" text,
  "contact_info" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_suppliers_company_idx" ON "cmv_suppliers" ("company_id");
CREATE INDEX "cmv_suppliers_company_name_idx" ON "cmv_suppliers" ("company_id", "name");

CREATE TABLE IF NOT EXISTS "cmv_supplier_ingredients" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "supplier_id" uuid NOT NULL REFERENCES "cmv_suppliers"("id"),
  "ingredient_id" uuid NOT NULL REFERENCES "cmv_ingredients"("id"),
  "price_per_unit_cents" integer NOT NULL,
  "recorded_at" timestamp with time zone NOT NULL DEFAULT now(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_supplier_ingredients_company_idx" ON "cmv_supplier_ingredients" ("company_id");
CREATE INDEX "cmv_supplier_ingredients_supplier_ingredient_idx" ON "cmv_supplier_ingredients" ("supplier_id", "ingredient_id");
CREATE INDEX "cmv_supplier_ingredients_ingredient_recorded_idx" ON "cmv_supplier_ingredients" ("ingredient_id", "recorded_at");

CREATE TABLE IF NOT EXISTS "cmv_purchases" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "supplier_id" uuid REFERENCES "cmv_suppliers"("id"),
  "invoice_date" timestamp with time zone NOT NULL,
  "total_amount_cents" integer NOT NULL,
  "invoice_number" text,
  "nfe_key" text,
  "source_type" text NOT NULL DEFAULT 'manual',
  "raw_data" text,
  "confirmed_by_user_id" text,
  "confirmed_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_purchases_company_invoice_date_idx" ON "cmv_purchases" ("company_id", "invoice_date");
CREATE INDEX "cmv_purchases_company_supplier_idx" ON "cmv_purchases" ("company_id", "supplier_id");

CREATE TABLE IF NOT EXISTS "cmv_purchase_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "purchase_id" uuid NOT NULL REFERENCES "cmv_purchases"("id"),
  "ingredient_id" uuid NOT NULL REFERENCES "cmv_ingredients"("id"),
  "quantity_milli" integer NOT NULL,
  "unit_price_cents" integer NOT NULL,
  "total_price_cents" integer NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_purchase_items_purchase_idx" ON "cmv_purchase_items" ("purchase_id");
CREATE INDEX "cmv_purchase_items_company_ingredient_idx" ON "cmv_purchase_items" ("company_id", "ingredient_id");

CREATE TABLE IF NOT EXISTS "cmv_recipes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "name" text NOT NULL,
  "category" text,
  "selling_price_cents" integer,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_recipes_company_idx" ON "cmv_recipes" ("company_id");
CREATE INDEX "cmv_recipes_company_name_idx" ON "cmv_recipes" ("company_id", "name");

CREATE TABLE IF NOT EXISTS "cmv_recipe_ingredients" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "recipe_id" uuid NOT NULL REFERENCES "cmv_recipes"("id"),
  "ingredient_id" uuid NOT NULL REFERENCES "cmv_ingredients"("id"),
  "quantity_milli" integer NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_recipe_ingredients_recipe_idx" ON "cmv_recipe_ingredients" ("recipe_id");
CREATE INDEX "cmv_recipe_ingredients_recipe_ingredient_idx" ON "cmv_recipe_ingredients" ("recipe_id", "ingredient_id");

CREATE TABLE IF NOT EXISTS "cmv_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "period_start" timestamp with time zone NOT NULL,
  "period_end" timestamp with time zone NOT NULL,
  "theoretical_cmv_bps" integer,
  "actual_cmv_bps" integer,
  "deviation_bps" integer,
  "faturamento_cents" integer,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_snapshots_company_period_idx" ON "cmv_snapshots" ("company_id", "period_start");

CREATE TABLE IF NOT EXISTS "cmv_alerts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id"),
  "alert_type" text NOT NULL,
  "severity" text NOT NULL,
  "message" text NOT NULL,
  "impact_cents" integer,
  "ingredient_id" uuid REFERENCES "cmv_ingredients"("id"),
  "supplier_id" uuid REFERENCES "cmv_suppliers"("id"),
  "created_by_agent_id" text,
  "resolved_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX "cmv_alerts_company_created_idx" ON "cmv_alerts" ("company_id", "created_at");
CREATE INDEX "cmv_alerts_company_resolved_idx" ON "cmv_alerts" ("company_id", "resolved_at");
