const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://xwpzmtcjxfyncnltgnmc.supabase.co";
const BUCKET_NAME = "images";

export function getRecipeImageUrl(
  slug: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  if (options) {
    const transforms = buildTransformParams(options);
    return `${SUPABASE_URL}/storage/v1/render/image/public/${BUCKET_NAME}/recipes/${slug}.jpg${transforms}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/recipes/${slug}.jpg`;
}

export function getStepImageUrl(
  stepId: string,
  options?: { width?: number; height?: number; quality?: number }
): string {
  if (options) {
    const transforms = buildTransformParams(options);
    return `${SUPABASE_URL}/storage/v1/render/image/public/${BUCKET_NAME}/steps/${stepId}.jpg${transforms}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/steps/${stepId}.jpg`;
}

export function getIngredientImageUrl(slug: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/ingredients/${slug}.png`;
}

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
