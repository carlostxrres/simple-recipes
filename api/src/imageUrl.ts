/**
 * =============================================================================
 * IMAGE URL HELPER
 * =============================================================================
 *
 * Generates public URLs for images stored in Supabase Storage.
 * Uses Supabase's image transformation API for optimized delivery.
 *
 * =============================================================================
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://xwpzmtcjxfyncnltgnmc.supabase.co";
const BUCKET_NAME = "images";

/**
 * Get the public URL for a recipe image.
 *
 * @param slug - The recipe slug (e.g., "pasta-carbonara")
 * @param options - Optional transformation options
 * @returns The public URL for the image
 */
export function getRecipeImageUrl(
  slug: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  const basePath = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/recipes/${slug}.jpg`;

  if (options) {
    const transforms = buildTransformParams(options);
    return `${SUPABASE_URL}/storage/v1/render/image/public/${BUCKET_NAME}/recipes/${slug}.jpg${transforms}`;
  }

  return basePath;
}

/**
 * Get the public URL for a step image.
 *
 * @param stepId - The step UUID
 * @param options - Optional transformation options
 * @returns The public URL for the image
 */
export function getStepImageUrl(
  stepId: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  const basePath = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/steps/${stepId}.jpg`;

  if (options) {
    const transforms = buildTransformParams(options);
    return `${SUPABASE_URL}/storage/v1/render/image/public/${BUCKET_NAME}/steps/${stepId}.jpg${transforms}`;
  }

  return basePath;
}

/**
 * Build URL query params for Supabase image transformations.
 */
function buildTransformParams(options: {
  width?: number;
  height?: number;
  quality?: number;
}): string {
  const params = new URLSearchParams();

  if (options.width) params.set("width", options.width.toString());
  if (options.height) params.set("height", options.height.toString());
  if (options.quality) params.set("quality", options.quality.toString());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
