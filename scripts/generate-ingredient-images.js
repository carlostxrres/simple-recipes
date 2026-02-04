/**
 * Ingredient Image Generator (Two-Step Style Transfer)
 *
 * 1. GPT-4o analyzes your reference images and extracts a detailed style description
 * 2. DALL-E 3 generates new images using that description
 *
 * Usage:
 *   1. Add reference images to the REFERENCE_IMAGES array below
 *   2. Set your OpenAI API key: $env:OPENAI_API_KEY = "your-key-here"
 *   3. Run: node scripts/generate-ingredient-images.js
 */

const fs = require("fs")
const path = require("path")

// ============================================================================
// CONFIGURATION
// ============================================================================

// Set to true once you're happy with the prompt to generate all images
const GENERATE_ALL = false

// Test with these ingredients first (use slugs from ingredients.json)
const TEST_INGREDIENTS = ["carrot", "salmon", "garlic"]

// Reference images - add paths to images that show the style you want
const REFERENCE_IMAGES = [
  "C:/Users/34644/Downloads/lemon.png",
  "C:/Users/34644/Downloads/potato.png",
  "C:/Users/34644/Downloads/cucumber.png",
]

// Output directory
const OUTPUT_DIR = path.join(__dirname, "..", "db", "images", "ingredients")

// Image settings
const IMAGE_SIZE = "1024x1024"
const IMAGE_QUALITY = "hd"

// ============================================================================
// SCRIPT
// ============================================================================

const INGREDIENTS_FILE = path.join(
  __dirname,
  "..",
  "db",
  "tables-json",
  "ingredients.json",
)

function imageToBase64Content(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath)
  const ext = path.extname(imagePath).toLowerCase()
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg"
  return {
    type: "image_url",
    image_url: {
      url: `data:${mimeType};base64,${imageBuffer.toString("base64")}`,
    },
  }
}

// Step 1: Analyze reference images with GPT-4o to get style description
async function analyzeStyleFromImages(referenceImages) {
  console.log("🔍 Analyzing reference images to extract style description...")

  const content = []

  // Add all reference images
  for (const imgPath of referenceImages) {
    content.push(imageToBase64Content(imgPath))
  }

  // Add the analysis prompt
  content.push({
    type: "text",
    text: `You are a professional photographer and art director. Analyze these reference images and describe their photographic style in extreme detail. I need to recreate this EXACT style for other food ingredients.

Describe in detail:
- Lighting setup (direction, intensity, softness, color temperature, shadows or lack thereof)
- Background (color, texture, gradient, pure white, etc.)
- Camera settings feel (depth of field, focus, perspective)
- Subject positioning and composition
- Overall mood and aesthetic
- Any post-processing characteristics

Be extremely specific and technical. Your description will be used as a prompt for DALL-E 3 to generate new images, so make it actionable and detailed. Focus on what makes these images consistent with each other.

Output ONLY the style description, no introduction or explanation. Start directly with the description.`,
  })

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content }],
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`GPT-4o Error: ${error.error?.message || JSON.stringify(error)}`)
  }

  const data = await response.json()
  const styleDescription = data.choices[0].message.content

  console.log("\n📝 Extracted style description:")
  console.log("─".repeat(60))
  console.log(styleDescription)
  console.log("─".repeat(60))

  return styleDescription
}

// Step 2: Generate image with DALL-E 3 using the style description
async function generateImage(ingredientName, slug, styleDescription) {
  console.log(`\n📸 Generating image for: ${ingredientName}`)

  const prompt = `A single ${ingredientName} (food ingredient). ${styleDescription}

IMPORTANT: Show ONLY the ${ingredientName}, nothing else. No text, no labels, no other objects.`

  console.log(`   Prompt length: ${prompt.length} characters`)

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: IMAGE_SIZE,
      quality: IMAGE_QUALITY,
      response_format: "b64_json",
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`DALL-E Error: ${error.error?.message || JSON.stringify(error)}`)
  }

  const data = await response.json()
  const imageBase64 = data.data[0].b64_json

  // Save the image
  const outputPath = path.join(OUTPUT_DIR, `${slug}.png`)
  fs.writeFileSync(outputPath, Buffer.from(imageBase64, "base64"))

  console.log(`   ✅ Saved to: ${outputPath}`)

  return outputPath
}

async function main() {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Error: OPENAI_API_KEY environment variable is not set.")
    console.error('   Set it with: $env:OPENAI_API_KEY = "your-key-here"')
    process.exit(1)
  }

  // Check for reference images
  if (REFERENCE_IMAGES.length === 0) {
    console.error("❌ Error: No reference images provided.")
    console.error("   Add image paths to the REFERENCE_IMAGES array in the script.")
    process.exit(1)
  }

  // Verify reference images exist
  for (const imgPath of REFERENCE_IMAGES) {
    if (!fs.existsSync(imgPath)) {
      console.error(`❌ Error: Reference image not found: ${imgPath}`)
      process.exit(1)
    }
  }

  console.log(`🖼️  Using ${REFERENCE_IMAGES.length} reference image(s) for style\n`)

  // Step 1: Analyze style from reference images (only once)
  const styleDescription = await analyzeStyleFromImages(REFERENCE_IMAGES)

  // Save the style description for reference
  const styleFilePath = path.join(OUTPUT_DIR, "_style_description.txt")
  fs.writeFileSync(styleFilePath, styleDescription)
  console.log(`\n💾 Style description saved to: ${styleFilePath}`)

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Load ingredients
  const ingredients = JSON.parse(fs.readFileSync(INGREDIENTS_FILE, "utf-8"))
  console.log(`\n📋 Loaded ${ingredients.length} ingredients from database`)

  // Determine which ingredients to process
  let toProcess
  if (GENERATE_ALL) {
    toProcess = ingredients
    console.log(`🚀 GENERATE_ALL is true - processing ALL ${ingredients.length} ingredients`)
  } else {
    toProcess = ingredients.filter((i) => TEST_INGREDIENTS.includes(i.slug))
    console.log(`🧪 Test mode - processing ${toProcess.length} test ingredients: ${TEST_INGREDIENTS.join(", ")}`)
  }

  if (toProcess.length === 0) {
    console.error("❌ No ingredients to process. Check TEST_INGREDIENTS slugs.")
    process.exit(1)
  }

  // Step 2: Generate images for each ingredient
  const results = { success: [], failed: [] }

  for (const ingredient of toProcess) {
    try {
      await generateImage(ingredient.name, ingredient.slug, styleDescription)
      results.success.push(ingredient.slug)

      // Rate limiting: wait 1 second between requests
      if (toProcess.indexOf(ingredient) < toProcess.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`)
      results.failed.push({ slug: ingredient.slug, error: error.message })
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60))
  console.log("📊 SUMMARY")
  console.log("=".repeat(60))
  console.log(`✅ Success: ${results.success.length}`)
  console.log(`❌ Failed: ${results.failed.length}`)

  if (results.failed.length > 0) {
    console.log("\nFailed ingredients:")
    results.failed.forEach((f) => console.log(`   - ${f.slug}: ${f.error}`))
  }

  if (!GENERATE_ALL && results.success.length > 0) {
    console.log("\n💡 Happy with the results? Set GENERATE_ALL = true to process all ingredients.")
    console.log(`   Estimated cost for all ${ingredients.length} ingredients: ~$${(ingredients.length * 0.08).toFixed(2)} (HD)`)
  }
}

main().catch(console.error)
