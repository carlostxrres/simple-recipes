/**
 * =============================================================================
 * DATABASE SEEDING SCRIPT
 * =============================================================================
 *
 * This script reads JSON files and inserts the data into PostgreSQL.
 *
 * BEFORE RUNNING THIS SCRIPT:
 * 1. Make sure PostgreSQL is installed and running
 * 2. Create a database: createdb recipes_db
 * 3. Run the schema first: psql -d recipes_db -f schema.sql
 * 4. Install the pg library: npm install pg
 * 5. Update the connection settings below with your credentials
 * 6. Run this script: node seed-database.js
 *
 * =============================================================================
 */

const fs = require("fs")
const path = require("path")
const { Client } = require("pg")

// =============================================================================
// DATABASE CONNECTION SETTINGS
// =============================================================================
// This is your Supabase connection string.
// In a real project, you'd store this in an environment variable for security,
// like: const connectionString = process.env.DATABASE_URL;
const connectionString =
  "postgresql://postgres.xwpzmtcjxfyncnltgnmc:Nem06e0ULskBpWm6@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true"
// postgresql://postgres:Nem06e0ULskBpWm6@db.xwpzmtcjxfyncnltgnmc.supabase.co:5432/postgres

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Reads a JSON file and returns the parsed data.
 *
 * @param {string} filename - Name of the JSON file (without path)
 * @returns {Array} - The parsed JSON data
 */
function readJsonFile(filename) {
  const filePath = path.join(__dirname, "tables-json", filename)
  const rawData = fs.readFileSync(filePath, "utf8")
  return JSON.parse(rawData)
}

/**
 * Removes duplicate objects from an array based on a key.
 *
 * WHY DO WE NEED THIS?
 * Your JSON files have duplicate entries (same ID appears multiple times).
 * In a database, each row must have a unique primary key, so we need to
 * remove duplicates before inserting.
 *
 * @param {Array} array - Array of objects
 * @param {string} key - The key to check for duplicates (usually 'id')
 * @returns {Array} - Array with duplicates removed
 */
function removeDuplicates(array, key = "id") {
  const seen = new Set()
  return array.filter((item) => {
    const value = item[key]
    if (seen.has(value)) {
      return false // Skip duplicate
    }
    seen.add(value)
    return true // Keep first occurrence
  })
}

/**
 * Removes duplicate objects based on multiple keys (for junction tables).
 * Junction tables have composite primary keys (two columns together form the key).
 *
 * @param {Array} array - Array of objects
 * @param {string[]} keys - Array of keys that together form the unique identifier
 * @returns {Array} - Array with duplicates removed
 */
function removeDuplicatesByKeys(array, keys) {
  const seen = new Set()
  return array.filter((item) => {
    const compositeKey = keys.map((k) => item[k]).join("|")
    if (seen.has(compositeKey)) {
      return false
    }
    seen.add(compositeKey)
    return true
  })
}

/**
 * Escapes a value for safe SQL insertion.
 *
 * IMPORTANT: In real applications, ALWAYS use parameterized queries (which we do below)
 * to prevent SQL injection attacks. This function is just for educational purposes.
 */
function escapeValue(value) {
  if (value === null || value === undefined) {
    return "NULL"
  }
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE"
  }
  if (typeof value === "number") {
    return value.toString()
  }
  // For strings, escape single quotes by doubling them
  return `'${value.toString().replace(/'/g, "''")}'`
}

// =============================================================================
// INSERT FUNCTIONS
// =============================================================================
// Each function inserts data into a specific table.
// We use parameterized queries ($1, $2, etc.) for security.

/**
 * Inserts data into a simple lookup table (allergens, tags, cuisines, utensils).
 * These tables all have the same structure: id, slug, name
 */
async function insertLookupTable(client, tableName, data) {
  console.log(`\nInserting into ${tableName}...`)

  // Remove duplicates
  const uniqueData = removeDuplicates(data, "id")
  console.log(`  Found ${data.length} records, ${uniqueData.length} unique`)

  let insertedCount = 0

  for (const item of uniqueData) {
    try {
      // ON CONFLICT DO NOTHING means: if this ID already exists, skip it
      // This is useful when running the script multiple times
      await client.query(
        `INSERT INTO ${tableName} (id, slug, name)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (id) DO NOTHING`,
        [item.id, item.slug, item.name],
      )
      insertedCount++
    } catch (error) {
      console.error(`  Error inserting ${item.id}:`, error.message)
    }
  }

  console.log(`  Inserted ${insertedCount} records`)
}

/**
 * Inserts ingredients into the ingredients table.
 */
async function insertIngredients(client, data) {
  console.log("\nInserting into ingredients...")

  const uniqueData = removeDuplicates(data, "id")
  console.log(`  Found ${data.length} records, ${uniqueData.length} unique`)

  let insertedCount = 0

  for (const item of uniqueData) {
    try {
      await client.query(
        `INSERT INTO ingredients (id, slug, name, is_pantry_ingredient)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (id) DO NOTHING`,
        [item.id, item.slug, item.name, item.is_pantry_ingredient],
      )
      insertedCount++
    } catch (error) {
      console.error(`  Error inserting ${item.id}:`, error.message)
    }
  }

  console.log(`  Inserted ${insertedCount} records`)
}

/**
 * Inserts recipes into the recipes table.
 * This is the most complex insert because recipes have many fields.
 */
async function insertRecipes(client, data) {
  console.log("\nInserting into recipes...")

  const uniqueData = removeDuplicates(data, "id")
  console.log(`  Found ${data.length} records, ${uniqueData.length} unique`)

  let insertedCount = 0

  for (const recipe of uniqueData) {
    try {
      // Note: difficulty needs to be a string ('1', '2', or '3') because
      // we defined it as an ENUM type in the schema
      await client.query(
        `INSERT INTO recipes (
                    id, slug, is_active, created_at, last_updated_at,
                    name, headline, description, has_image, time_minutes,
                    difficulty, nutrition_energy_kj, nutrition_energy_kcal,
                    nutrition_fat, nutrition_fat_saturated, nutrition_carbs,
                    nutrition_carbs_sugar, nutrition_fiber, nutrition_protein,
                    nutrition_sodium
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
                ) ON CONFLICT (id) DO NOTHING`,
        [
          recipe.id,
          recipe.slug,
          recipe.is_active,
          recipe.created_at,
          recipe.last_updated_at,
          recipe.name,
          recipe.headline,
          recipe.description,
          recipe.has_image,
          recipe.time_minutes,
          recipe.difficulty.toString(), // Convert to string for ENUM
          recipe.nutrition_energy_kj,
          recipe.nutrition_energy_kcal,
          recipe.nutrition_fat,
          recipe.nutrition_fat_saturated,
          recipe.nutrition_carbs,
          recipe.nutrition_carbs_sugar,
          recipe.nutrition_fiber,
          recipe.nutrition_protein,
          recipe.nutrition_sodium,
        ],
      )
      insertedCount++
    } catch (error) {
      console.error(`  Error inserting recipe ${recipe.id}:`, error.message)
    }
  }

  console.log(`  Inserted ${insertedCount} records`)
}

/**
 * Inserts steps into the steps table.
 */
async function insertSteps(client, data) {
  console.log("\nInserting into steps...")

  const uniqueData = removeDuplicates(data, "id")
  console.log(`  Found ${data.length} records, ${uniqueData.length} unique`)

  let insertedCount = 0

  for (const step of uniqueData) {
    try {
      await client.query(
        `INSERT INTO steps (id, recipe_id, step_order, instructions, has_image)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (id) DO NOTHING`,
        [
          step.id,
          step.recipe_id,
          step.step_order,
          step.instructions,
          step.has_image,
        ],
      )
      insertedCount++
    } catch (error) {
      console.error(`  Error inserting step ${step.id}:`, error.message)
    }
  }

  console.log(`  Inserted ${insertedCount} records`)
}

/**
 * Inserts ingredient_allergens (junction table).
 *
 * WHAT IS A JUNCTION TABLE?
 * A junction table connects two tables in a many-to-many relationship.
 * One ingredient can have multiple allergens, and one allergen can be in many ingredients.
 * The junction table stores these connections.
 */
async function insertIngredientAllergens(client, data) {
  console.log("\nInserting into ingredient_allergens...")

  // For junction tables, we check for duplicates using both foreign keys
  const uniqueData = removeDuplicatesByKeys(data, [
    "ingredient_id",
    "allergen_id",
  ])
  console.log(`  Found ${data.length} records, ${uniqueData.length} unique`)

  let insertedCount = 0

  for (const item of uniqueData) {
    try {
      await client.query(
        `INSERT INTO ingredient_allergens (ingredient_id, allergen_id, traces_of)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (ingredient_id, allergen_id) DO NOTHING`,
        [item.ingredient_id, item.allergen_id, item.traces_of],
      )
      insertedCount++
    } catch (error) {
      // Foreign key errors are expected if allergen/ingredient doesn't exist
      if (!error.message.includes("violates foreign key")) {
        console.error(`  Error:`, error.message)
      }
    }
  }

  console.log(`  Inserted ${insertedCount} records`)
}

/**
 * Inserts recipe_ingredients (junction table with extra data).
 */
async function insertRecipeIngredients(client, data) {
  console.log("\nInserting into recipe_ingredients...")

  const uniqueData = removeDuplicatesByKeys(data, [
    "recipe_id",
    "ingredient_id",
  ])
  console.log(`  Found ${data.length} records, ${uniqueData.length} unique`)

  let insertedCount = 0

  for (const item of uniqueData) {
    try {
      await client.query(
        `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity_amount, quantity_unit)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (recipe_id, ingredient_id) DO NOTHING`,
        [
          item.recipe_id,
          item.ingredient_id,
          item.quantity_amount,
          item.quantity_unit,
        ],
      )
      insertedCount++
    } catch (error) {
      if (!error.message.includes("violates foreign key")) {
        console.error(`  Error:`, error.message)
      }
    }
  }

  console.log(`  Inserted ${insertedCount} records`)
}

/**
 * Inserts into a simple junction table (recipe_tags, recipe_cuisines, recipe_utensils).
 */
async function insertSimpleJunction(client, tableName, data, key1, key2) {
  console.log(`\nInserting into ${tableName}...`)

  const uniqueData = removeDuplicatesByKeys(data, [key1, key2])
  console.log(`  Found ${data.length} records, ${uniqueData.length} unique`)

  let insertedCount = 0

  for (const item of uniqueData) {
    try {
      await client.query(
        `INSERT INTO ${tableName} (${key1}, ${key2})
                 VALUES ($1, $2)
                 ON CONFLICT (${key1}, ${key2}) DO NOTHING`,
        [item[key1], item[key2]],
      )
      insertedCount++
    } catch (error) {
      if (!error.message.includes("violates foreign key")) {
        console.error(`  Error:`, error.message)
      }
    }
  }

  console.log(`  Inserted ${insertedCount} records`)
}

// =============================================================================
// MAIN FUNCTION
// =============================================================================

async function seedDatabase() {
  console.log("=".repeat(60))
  console.log("DATABASE SEEDING SCRIPT")
  console.log("=".repeat(60))

  // Create a new database client using the connection string
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
  })

  try {
    // Connect to the database
    console.log("\nConnecting to PostgreSQL...")
    await client.connect()
    console.log("Connected successfully!")

    // =================================================================
    // INSERTION ORDER MATTERS!
    // =================================================================
    // In relational databases, we must respect foreign key constraints.
    // This means we must insert data in the correct order:
    //
    // 1. First: Tables with no foreign keys (lookup tables)
    // 2. Second: Tables that reference the lookup tables
    // 3. Third: Junction tables that reference multiple tables
    // =================================================================

    // STEP 1: Insert lookup tables (no foreign keys)
    console.log("\n--- STEP 1: Inserting lookup tables ---")

    const allergens = readJsonFile("allergens.json")
    await insertLookupTable(client, "allergens", allergens)

    const tags = readJsonFile("tags.json")
    await insertLookupTable(client, "tags", tags)

    const cuisines = readJsonFile("cuisines.json")
    await insertLookupTable(client, "cuisines", cuisines)

    const utensils = readJsonFile("utensils.json")
    await insertLookupTable(client, "utensils", utensils)

    // STEP 2: Insert ingredients (no foreign keys in main table)
    console.log("\n--- STEP 2: Inserting ingredients ---")

    const ingredients = readJsonFile("ingredients.json")
    await insertIngredients(client, ingredients)

    // STEP 3: Insert ingredient_allergens (references ingredients AND allergens)
    console.log("\n--- STEP 3: Inserting ingredient allergens ---")

    const ingredientAllergens = readJsonFile("ingredient_allergens.json")
    await insertIngredientAllergens(client, ingredientAllergens)

    // STEP 4: Insert recipes (no foreign keys)
    console.log("\n--- STEP 4: Inserting recipes ---")

    const recipes = readJsonFile("recipes.json")
    await insertRecipes(client, recipes)

    // STEP 5: Insert steps (references recipes)
    console.log("\n--- STEP 5: Inserting steps ---")

    const steps = readJsonFile("steps.json")
    await insertSteps(client, steps)

    // STEP 6: Insert recipe junction tables
    console.log("\n--- STEP 6: Inserting recipe relationships ---")

    const recipeIngredients = readJsonFile("recipe_ingredients.json")
    await insertRecipeIngredients(client, recipeIngredients)

    const recipeTags = readJsonFile("recipe_tags.json")
    await insertSimpleJunction(
      client,
      "recipe_tags",
      recipeTags,
      "recipe_id",
      "tag_id",
    )

    const recipeCuisines = readJsonFile("recipe_cuisines.json")
    await insertSimpleJunction(
      client,
      "recipe_cuisines",
      recipeCuisines,
      "recipe_id",
      "cuisine_id",
    )

    const recipeUtensils = readJsonFile("recipe_utensils.json")
    await insertSimpleJunction(
      client,
      "recipe_utensils",
      recipeUtensils,
      "recipe_id",
      "utensil_id",
    )

    // Done!
    console.log("\n" + "=".repeat(60))
    console.log("DATABASE SEEDING COMPLETE!")
    console.log("=".repeat(60))

    // Let's verify by counting records in each table
    console.log("\nVerifying data (record counts):")
    const tables = [
      "allergens",
      "tags",
      "cuisines",
      "utensils",
      "ingredients",
      "ingredient_allergens",
      "recipes",
      "steps",
      "recipe_ingredients",
      "recipe_tags",
      "recipe_cuisines",
      "recipe_utensils",
    ]

    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`)
      console.log(`  ${table}: ${result.rows[0].count} records`)
    }
  } catch (error) {
    console.error("\nError:", error.message)
    console.error("\nTroubleshooting tips:")
    console.error("1. Is PostgreSQL running?")
    console.error("2. Did you create the database? Run: createdb recipes_db")
    console.error(
      "3. Did you run the schema? Run: psql -d recipes_db -f schema.sql",
    )
    console.error("4. Are your connection settings correct?")
  } finally {
    // Always close the connection when done
    await client.end()
    console.log("\nDatabase connection closed.")
  }
}

// Run the script
seedDatabase()
