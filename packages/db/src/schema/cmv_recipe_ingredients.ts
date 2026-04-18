import { pgTable, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { companies } from "./companies.js";
import { cmvRecipes } from "./cmv_recipes.js";
import { cmvIngredients } from "./cmv_ingredients.js";

export const cmvRecipeIngredients = pgTable(
  "cmv_recipe_ingredients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id),
    recipeId: uuid("recipe_id").notNull().references(() => cmvRecipes.id),
    ingredientId: uuid("ingredient_id").notNull().references(() => cmvIngredients.id),
    // Quantity stored in milli-units to avoid decimals: 1500 = 1.500 kg
    quantityMilli: integer("quantity_milli").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    recipeIdx: index("cmv_recipe_ingredients_recipe_idx").on(table.recipeId),
    recipeIngredientIdx: index("cmv_recipe_ingredients_recipe_ingredient_idx").on(
      table.recipeId,
      table.ingredientId,
    ),
  }),
);

export type CmvRecipeIngredient = typeof cmvRecipeIngredients.$inferSelect;
export type NewCmvRecipeIngredient = typeof cmvRecipeIngredients.$inferInsert;
