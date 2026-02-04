// Upload images from local to supabase bucket

import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// =============================================================================
// CONFIGURATION - Replace with your values from Supabase Dashboard
// =============================================================================
const SUPABASE_URL = "https://xwpzmtcjxfyncnltgnmc.supabase.co"
const SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cHptdGNqeGZ5bmNubHRnbm1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTI5MzUwOSwiZXhwIjoyMDg0ODY5NTA5fQ.gjLBcqNh2uIrlK0l-uRfQdZplXzWFMwp-0xfaeFCdbc"
const BUCKET_NAME = "images"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// =============================================================================
// UPLOAD FUNCTIONS
// =============================================================================

async function uploadFile(localPath, storagePath) {
  const fileBuffer = fs.readFileSync(localPath)
  const contentType = "image/jpeg"

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true, // Overwrite if exists
    })

  if (error) {
    console.error(`Failed to upload ${storagePath}:`, error.message)
    return false
  }

  console.log(`Uploaded: ${storagePath}`)
  return true
}

async function uploadDirectory(localDir, storagePrefix) {
  const files = fs.readdirSync(localDir)
  let uploaded = 0
  let failed = 0

  for (const file of files) {
    const localPath = path.join(localDir, file)
    const storagePath = `${storagePrefix}/${file}`

    const success = await uploadFile(localPath, storagePath)
    if (success) uploaded++
    else failed++
  }

  return { uploaded, failed }
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log("Starting image upload to Supabase Storage...\n")

  // // Upload recipe images
  // console.log("Uploading recipe images...")
  // const recipeResults = await uploadDirectory("./images/recipes", "recipes")
  // console.log(
  //   `Recipes: ${recipeResults.uploaded} uploaded, ${recipeResults.failed} failed\n`,
  // )

  // // Upload step images
  // console.log("Uploading step images...")
  // const stepResults = await uploadDirectory("./images/steps", "steps")
  // console.log(
  //   `Steps: ${stepResults.uploaded} uploaded, ${stepResults.failed} failed\n`,
  // )

  // Upload ingredient images
  console.log("Uploading ingredient images...")
  const ingredientResults = await uploadDirectory(
    "./images/ingredients",
    "ingredients",
  )
  console.log(
    `Ingredients: ${ingredientResults.uploaded} uploaded, ${ingredientResults.failed} failed\n`,
  )

  // // Print summary
  // console.log("=".repeat(50))
  // console.log("Upload complete!")
  // console.log(
  //   `Total uploaded: ${recipeResults.uploaded + stepResults.uploaded}`,
  // )
  // console.log(`Total failed: ${recipeResults.failed + stepResults.failed}`)
  // console.log("\nYour images are now available at:")
  // console.log(
  //   `  ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/recipes/{slug}.jpg`,
  // )
  // console.log(
  //   `  ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/steps/{id}.jpg`,
  // )
}

main().catch(console.error)
