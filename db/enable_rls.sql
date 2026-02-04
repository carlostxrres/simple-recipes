-- Enable Row Level Security (RLS) with user ownership support
--
-- This migration:
-- 1. Adds user_id column to recipes (for future ownership)
-- 2. Enables RLS on all tables
-- 3. Creates policies ready for Supabase Auth
--
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================================
-- ADD USER OWNERSHIP TO RECIPES
-- ============================================================

-- Add user_id column (nullable for existing recipes without owners)
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Index for efficient ownership queries
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE utensils ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_utensils ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- LOOKUP TABLES (allergens, tags, cuisines, utensils, ingredients)
-- Public read-only. Only admins (via service role) can modify.
-- ============================================================

CREATE POLICY "Public read access" ON allergens FOR SELECT USING (true);
CREATE POLICY "Public read access" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cuisines FOR SELECT USING (true);
CREATE POLICY "Public read access" ON utensils FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ingredients FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ingredient_allergens FOR SELECT USING (true);

-- ============================================================
-- RECIPES TABLE
-- Anyone can read. Authenticated users can create/edit/delete their own.
-- ============================================================

-- Anyone can view all recipes
CREATE POLICY "Anyone can view recipes" ON recipes
    FOR SELECT USING (true);

-- Authenticated users can create recipes (auto-assigned to them)
CREATE POLICY "Users can create own recipes" ON recipes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own recipes
CREATE POLICY "Users can update own recipes" ON recipes
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own recipes
CREATE POLICY "Users can delete own recipes" ON recipes
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STEPS TABLE
-- Anyone can read. Recipe owner can modify steps for their recipes.
-- ============================================================

CREATE POLICY "Anyone can view steps" ON steps
    FOR SELECT USING (true);

CREATE POLICY "Recipe owner can create steps" ON steps
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can update steps" ON steps
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can delete steps" ON steps
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

-- ============================================================
-- RECIPE JUNCTION TABLES (recipe_ingredients, recipe_tags, etc.)
-- Anyone can read. Recipe owner can modify associations.
-- ============================================================

-- recipe_ingredients
CREATE POLICY "Anyone can view recipe ingredients" ON recipe_ingredients
    FOR SELECT USING (true);

CREATE POLICY "Recipe owner can manage ingredients" ON recipe_ingredients
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can update ingredients" ON recipe_ingredients
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can remove ingredients" ON recipe_ingredients
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

-- recipe_tags
CREATE POLICY "Anyone can view recipe tags" ON recipe_tags
    FOR SELECT USING (true);

CREATE POLICY "Recipe owner can add tags" ON recipe_tags
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can update tags" ON recipe_tags
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can remove tags" ON recipe_tags
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

-- recipe_cuisines
CREATE POLICY "Anyone can view recipe cuisines" ON recipe_cuisines
    FOR SELECT USING (true);

CREATE POLICY "Recipe owner can add cuisines" ON recipe_cuisines
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can update cuisines" ON recipe_cuisines
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can remove cuisines" ON recipe_cuisines
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

-- recipe_utensils
CREATE POLICY "Anyone can view recipe utensils" ON recipe_utensils
    FOR SELECT USING (true);

CREATE POLICY "Recipe owner can add utensils" ON recipe_utensils
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can update utensils" ON recipe_utensils
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );

CREATE POLICY "Recipe owner can remove utensils" ON recipe_utensils
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM recipes WHERE id = recipe_id AND user_id = auth.uid())
    );
