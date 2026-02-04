// Download images from HelloFresh to local

import { readFile, writeFile } from "fs/promises"
import fs from "fs"
import https from "https" // Use 'http' if the URL is http://

main()

async function main() {
  try {
    const rawData = await readFile("./data.json", "utf-8")
    const recipes = JSON.parse(rawData)

    const ourRecipesRaw = await readFile("./tables-json/recipes.json", "utf-8")
    const ourRecipes = JSON.parse(ourRecipesRaw)
    const ourRecipeIds = ourRecipes.map((r) => r.id)

    const rawSteps = await readFile("./tables-json/steps.json", "utf-8")
    const steps = JSON.parse(rawSteps)

    for (const recipeId of ourRecipeIds) {
      const recipe = recipes[recipeId]

      // Download main image
      // Get the URL to download
      const recipePath = recipe.imagePath
      const recipeImageUrl = `https://img.hellofresh.com/f_auto,fl_lossy,h_699,q_auto,w_1048//hellofresh_s3${recipePath}`

      // Get the filename
      const recipeFileExtension = urlToFileExtension(recipePath)
      const recipeSavePath = `./images/recipes/${recipe.slug}.${recipeFileExtension}`

      // Save if it does not exist
      if (fs.existsSync(recipeSavePath)) {
        console.log(
          `Image already exists at ${recipeSavePath}, skipping download.`,
        )
      } else {
        downloadImage(recipeImageUrl, recipeSavePath)
      }

      // Download step images
      for (const step of recipe.steps) {
        // Get the URL to download
        const stepPath = step.images[0].path
        const stepImageUrl = `https://media.hellofresh.com/w_750,q_auto,f_auto,c_limit,fl_lossy/hellofresh_s3${stepPath}`

        // Get the filename
        const stepFileExtension = urlToFileExtension(stepPath)
        let stepId // We need the step ID, that's not in data.json (it's ours), so we can get it from recipe id and step_order
        try {
          const stepData = steps.find(
            (s) => s.recipe_id === recipe.id && s.step_order === step.index,
          )
          stepId = stepData.id
        } catch (err) {
          throw new Error(
            `Step data not found for recipe ID ${recipe.id} step index ${step.index}`,
          )
        }
        const stepSavePath = `./images/steps/${stepId}.${stepFileExtension}`

        // Save if it does not exist
        if (fs.existsSync(stepSavePath)) {
          console.log(
            `Image already exists at ${stepSavePath}, skipping download.`,
          )
        } else {
          downloadImage(stepImageUrl, stepSavePath)
        }
      }
    }
  } catch (err) {
    console.error("Error:", err.message)
  }
}

function downloadImage(url, destinationPath) {
  const file = fs.createWriteStream(destinationPath)

  https
    .get(url, (response) => {
      response.pipe(file)
      file.on("finish", () => {
        file.close() // Close the file stream
        console.log(`Image downloaded to ${destinationPath}`)
      })
    })
    .on("error", (err) => {
      fs.unlink(destinationPath, () => {}) // Delete the file if an error occurs
      console.error(`Error downloading image: ${err.message}`)
    })
}

function urlToFileExtension(url) {
  return url.split(".").pop().split("?")[0]
}
