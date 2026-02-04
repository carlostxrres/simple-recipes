const { readFile, writeFile } = require("fs/promises")

const INPUT_FILE = "./data.json"

async function main() {
  try {
    const rawData = await readFile(INPUT_FILE, "utf-8")
    const data = JSON.parse(rawData)

    // // ALLERGENS
    // const allergens = Object.values(data)
    //   .flatMap((r) => r.allergens)
    //   .map((a) => ({
    //     id: a.id.trim(),
    //     slug: a.type.trim(),
    //     name: a.name.trim(),
    //   }))
    // const uniqueAllergens = getUniqueByProp(allergens)
    // await writeFile(
    //   "./tables-json/allergens.json",
    //   JSON.stringify(uniqueAllergens, null, 2),
    //   "utf-8",
    // )

    // // TAGS
    // const tags = Object.values(data)
    //   .flatMap((r) => r.tags)
    //   .map((t) => ({
    //     id: t.id.trim(),
    //     slug: t.type.trim(),
    //     name: t.name.trim(),
    //   }))
    // const uniqueTags = getUniqueByProp(tags)
    // await writeFile(
    //   "./tables-json/tags.json",
    //   JSON.stringify(uniqueTags, null, 2),
    //   "utf-8",
    // )

    // // INGREDIENTS
    // const ingredients = Object.values(data)
    //   .flatMap((r) => r.ingredients)
    //   .map((a) => ({
    //     id: a.id.trim(),
    //     slug: a.type.trim(),
    //     name: a.name.trim(),
    //     is_pantry_ingredient: Object.hasOwn(a, "shipped")
    //       ? !a.isPantryIngredient
    //       : false,
    //   }))
    // const uniqueIngredients = getUniqueByProp(ingredients)
    // await writeFile(
    //   "./tables-json/ingredients.json",
    //   JSON.stringify(uniqueIngredients, null, 2),
    //   "utf-8",
    // )

    // // RECIPES
    // const recipes = Object.values(data).map((r) => ({
    //   id: r.id,
    //   is_active: r.active,
    //   created_at: r.createdAt,
    //   last_updated_at: r.updatedAt,
    //   name: r.name,
    //   slug: r.slug,
    //   headline: r.headline,
    //   description: r.description,
    //   has_image: true,
    //   time_minutes: Number(r.totalTime.match(/\d+/)[0]),
    //   difficulty: r.difficulty,
    //
    //   // nutrition fields
    //   nutrition_energy_kj: r.nutrition[0].amount,
    //   nutrition_energy_kcal: r.nutrition[1].amount,
    //   nutrition_fat: r.nutrition[2].amount,
    //   nutrition_fat_saturated: r.nutrition[3].amount,
    //   nutrition_carbs: r.nutrition[4].amount,
    //   nutrition_carbs_sugar: r.nutrition[5].amount,
    //   nutrition_fiber: r.nutrition[6].amount,
    //   nutrition_protein: r.nutrition[7].amount,
    //   nutrition_sodium: r.nutrition[8].amount,
    // }))
    // const recipeSlugs = new Set()
    // const uniqueSlugRecipes = recipes.filter((item) => {
    //   if (recipeSlugs.has(item.slug)) {
    //     return false
    //   } else {
    //     recipeSlugs.add(item.slug)
    //     return true
    //   }
    // })
    // await writeFile(
    //   "./tables-json/recipes.json",
    //   JSON.stringify(uniqueSlugRecipes, null, 2),
    //   "utf-8",
    // )

    // // STEPS
    // const rawRecipes = await readFile("./tables-json/recipes.json", "utf-8")
    // const recipeIds = JSON.parse(rawRecipes).map((r) => r.id)
    // const steps = Object.values(data)
    //   .flatMap((r) => {
    //     return r.steps.map((s) => ({
    //
    //       // DANGER
    //       id: crypto.randomUUID(), // DANGER: if the steps exist already, do not create new ID. Get the existing one.
    //       // DANGER
    //
    //       recipe_id: r.id,
    //       step_order: s.index,
    //       instructions: s.instructions.trim(),
    //       has_image: true,
    //     }))
    //   })
    //   .filter((step) => recipeIds.includes(step.recipe_id))
    // await writeFile(
    //   "./tables-json/steps.json",
    //   JSON.stringify(steps, null, 2),
    //   "utf-8",
    // )

    // RECIPE_INGREDIENTS
    // const recipeIngredients = Object.values(data).flatMap((r) => {
    //   return r.yields[0].ingredients.map((i) => ({
    //     recipe_id: r.id,
    //     ingredient_id: i.id,
    //     quantity_amount: i.unit === "Al gusto" ? null : i.amount,
    //     quantity_unit: i.unit === "Al gusto" ? null : i.unit,
    //     // For "Al gusto" quantities, amount and unit will be NULL
    //   }))
    // })
    // await writeFile(
    //   "./tables-json/recipe_ingredients.json",
    //   JSON.stringify(recipeIngredients, null, 2),
    //   "utf-8",
    // )

    // RECIPE_TAGS
    // const recipeTags = Object.values(data).flatMap((r) => {
    //   return r.tags.map((t) => ({
    //     recipe_id: r.id,
    //     tag_id: t.id,
    //   }))
    // })
    // await writeFile(
    //   "./tables-json/recipe_tags.json",
    //   JSON.stringify(recipeTags, null, 2),
    //   "utf-8",
    // )

    // RECIPE_CUISINES
    // const recipeCuisines = Object.values(data).flatMap((r) => {
    //   return r.cuisines.map((c) => ({
    //     recipe_id: r.id,
    //     cuisine_id: c.id,
    //   }))
    // })
    // await writeFile(
    //   "./tables-json/recipe_cuisines.json",
    //   JSON.stringify(recipeCuisines, null, 2),
    //   "utf-8",
    // )

    // RECIPE_UTENSILS
    // const recipeUtensils = Object.values(data).flatMap((r) => {
    //   return r.utensils.map((u) => ({
    //     recipe_id: r.id,
    //     utensil_id: u.id,
    //   }))
    // })
    // await writeFile(
    //   "./tables-json/recipe_utensils.json",
    //   JSON.stringify(recipeUtensils, null, 2),
    //   "utf-8",
    // )

    // INGREDIENT_ALLERGENS
    // const ingredientAllergens = Object.values(data).flatMap((r) => {
    //   return r.ingredients.flatMap((i) => {
    //     return i.allergens.map((aId) => ({
    //       ingredient_id: i.id,
    //       allergen_id: aId,
    //       traces_of: r.allergens.find((a) => a.id === aId).tracesOf,
    //     }))
    //   })
    // })
    // const getIngredientAllergenToken = (ia) =>
    //   `${ia.ingredient_id}-${ia.allergen_id}`
    // const ingredientAllergenTokens = new Set()
    // const ingredientAllergensUnique = ingredientAllergens.filter((ia) => {
    //   const token = getIngredientAllergenToken(ia)
    //   if (ingredientAllergenTokens.has(token)) {
    //     return false
    //   } else {
    //     ingredientAllergenTokens.add(token)
    //     return true
    //   }
    // })
    // await writeFile(
    //   "./tables-json/ingredient_allergens.json",
    //   JSON.stringify(ingredientAllergensUnique, null, 2),
    //   "utf-8",
    // )
  } catch (err) {
    console.error("Error:", err.message)
  }
}

function getUniqueByProp(arr, prop = "id") {
  const ids = new Set()
  return arr.filter((item) => {
    if (ids.has(item[prop])) {
      return false
    } else {
      ids.add(item[prop])
      return true
    }
  })
}

main()
