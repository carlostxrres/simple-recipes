-- Recipe Database Schema
-- This file creates all tables for the recipe website.
-- Run this file in PostgreSQL to create the database structure.

-- ============================================================
-- LOOKUP TABLES (simple reference data)
-- These are independent tables that other tables reference.
-- We create them first because other tables depend on them.
-- ============================================================

-- Allergens: things like gluten, nuts, dairy, etc.
CREATE TABLE allergens (
    id TEXT PRIMARY KEY,           -- matches your AllergenId
    slug TEXT NOT NULL UNIQUE,     -- URL-friendly identifier
    name TEXT NOT NULL             -- display name (e.g., "Gluten", "Leche")
);

-- Tags: categories like "vegetarian", "quick meals", etc.
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

-- Cuisines: "Italian", "Mexican", "Spanish", etc.
CREATE TABLE cuisines (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

-- Utensils: "frying pan", "oven", "blender", etc.
CREATE TABLE utensils (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

-- ============================================================
-- INGREDIENTS TABLE
-- ============================================================

CREATE TABLE ingredients (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_pantry_ingredient BOOLEAN NOT NULL DEFAULT FALSE
);

-- Junction table: which allergens does each ingredient contain?
-- A junction table connects two tables in a many-to-many relationship.
-- One ingredient can have multiple allergens, and one allergen can be in multiple ingredients.
CREATE TABLE ingredient_allergens (
    ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
    allergen_id TEXT NOT NULL REFERENCES allergens(id),
    traces_of BOOLEAN NOT NULL DEFAULT FALSE,  -- true = "ingredient may contain traces of allergen"
    PRIMARY KEY (ingredient_id, allergen_id)   -- composite primary key
);

-- ============================================================
-- RECIPES TABLE (the main table)
-- ============================================================

-- We'll use an ENUM type for difficulty levels (1, 2, or 3)
-- This ensures only valid values can be inserted.
CREATE TYPE difficulty_level AS ENUM ('1', '2', '3');

-- We'll also create an ENUM for measurement units
CREATE TYPE recipe_unit AS ENUM (
    'cucharada(s)',
    'cucharadita(s)',
    'gramo(s)',
    'mililitro(s)',
    'paquete',
    'pizca(s)',
    'pouch(es)',
    'sobre(s)',
    'unidad(es)',
    'unit'
);

CREATE TABLE recipes (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    has_image BOOLEAN NOT NULL DEFAULT FALSE,  -- image URL derived from ID
    time_minutes INTEGER NOT NULL,             -- cooking time in minutes
    difficulty difficulty_level NOT NULL,

    -- Nutrition info (per 100g) - embedded directly in the recipes table
    -- This is simpler than a separate table since it's a 1:1 relationship
    nutrition_energy_kj NUMERIC NOT NULL,
    nutrition_energy_kcal NUMERIC NOT NULL,
    nutrition_fat NUMERIC NOT NULL,
    nutrition_fat_saturated NUMERIC NOT NULL,
    nutrition_carbs NUMERIC NOT NULL,
    nutrition_carbs_sugar NUMERIC NOT NULL,
    nutrition_fiber NUMERIC NOT NULL,
    nutrition_protein NUMERIC NOT NULL,
    nutrition_sodium NUMERIC NOT NULL
);

-- Now we can create the steps table with a foreign key to recipes
CREATE TABLE steps (
    id TEXT PRIMARY KEY,
    recipe_id TEXT NOT NULL REFERENCES recipes(id),  -- each step belongs to one recipe
    step_order INTEGER NOT NULL,                      -- 1, 2, 3... to maintain order
    instructions TEXT NOT NULL,
    has_image BOOLEAN NOT NULL DEFAULT FALSE         -- image URL derived from ID
);

-- ============================================================
-- JUNCTION TABLES FOR RECIPES
-- These connect recipes to their related data.
-- ============================================================

-- Recipe ingredients (with quantity information)
CREATE TABLE recipe_ingredients (
    recipe_id TEXT NOT NULL REFERENCES recipes(id),
    ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
    -- For "Al gusto" quantities, amount and unit will be NULL
    quantity_amount NUMERIC,
    quantity_unit recipe_unit,
    PRIMARY KEY (recipe_id, ingredient_id)
);

-- Recipe tags
CREATE TABLE recipe_tags (
    recipe_id TEXT NOT NULL REFERENCES recipes(id),
    tag_id TEXT NOT NULL REFERENCES tags(id),
    PRIMARY KEY (recipe_id, tag_id)
);

-- Recipe cuisines
CREATE TABLE recipe_cuisines (
    recipe_id TEXT NOT NULL REFERENCES recipes(id),
    cuisine_id TEXT NOT NULL REFERENCES cuisines(id),
    PRIMARY KEY (recipe_id, cuisine_id)
);

-- Recipe utensils
CREATE TABLE recipe_utensils (
    recipe_id TEXT NOT NULL REFERENCES recipes(id),
    utensil_id TEXT NOT NULL REFERENCES utensils(id),
    PRIMARY KEY (recipe_id, utensil_id)
);

-- ============================================================
-- INDEXES
-- Indexes speed up queries. We add them on columns we'll search by.
-- ============================================================

CREATE INDEX idx_recipes_is_active ON recipes(is_active);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_ingredients_is_pantry ON ingredients(is_pantry_ingredient);
CREATE INDEX idx_steps_recipe_id ON steps(recipe_id);  -- for fetching steps by recipe
